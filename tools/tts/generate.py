#!/usr/bin/env python
"""Generation de voix edge-tts a partir d'un manifeste JSON.

Manifeste : [{"key": "intro_1", "text": "...", "voice": "fr-FR-HenriNeural", "rate": "+10%", "pitch": "+2Hz"}, ...]
  - voice par defaut : --voice (sinon obligatoire par entree)
  - rate/pitch/volume optionnels, format edge-tts ("+10%", "-20%", "+5Hz", "-10%")
Sortie : <out>/<key>.mp3 ; cache <out>/.tts-cache.json (hash texte+voix+params+post-traitement) :
  seules les entrees nouvelles / modifiees sont regenerees. Rapport : <out>/.tts-report.json + resume stdout.

Usage : tools/tts/.venv/Scripts/python tools/tts/generate.py manifest.json out_dir [--concurrency 3] [--retries 4] [--force] [--no-normalize]
"""
import argparse, asyncio, hashlib, json, os, shutil, subprocess, sys, tempfile, time
from pathlib import Path

import edge_tts

POST_VERSION = 1  # incrementer si la chaine ffmpeg change (invalide le cache)
FFMPEG = shutil.which("ffmpeg")


def entry_hash(e, normalize):
    payload = json.dumps(
        [e["text"], e["voice"], e.get("rate", ""), e.get("pitch", ""), e.get("volume", ""), normalize, POST_VERSION],
        ensure_ascii=False,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def post_process(src: Path, dst: Path):
    """Supprime le silence initial, normalise ~-16 LUFS, mp3 mono 24 kHz 64k."""
    af = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,loudnorm=I=-16:TP=-1.5:LRA=9"
    subprocess.run(
        [FFMPEG, "-v", "error", "-y", "-i", str(src), "-af", af, "-ac", "1", "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "64k", str(dst)],
        check=True,
    )


async def synth(e, out: Path, retries: int, normalize: bool):
    last = None
    for attempt in range(1, retries + 2):
        fd, name = tempfile.mkstemp(suffix=".mp3", prefix=".tmp-", dir=out)
        os.close(fd)
        tmp = Path(name)
        try:
            kw = {k: e[k] for k in ("rate", "pitch", "volume") if e.get(k)}
            await edge_tts.Communicate(e["text"], e["voice"], **kw).save(str(tmp))
            if tmp.stat().st_size < 500:
                raise RuntimeError("audio vide")
            final = out / f"{e['key']}.mp3"
            if normalize and FFMPEG:
                tmp2 = tmp.with_suffix(".norm.mp3")
                post_process(tmp, tmp2)
                os.replace(tmp2, final)
            else:
                os.replace(tmp, final)
            return attempt, None
        except Exception as ex:  # noqa: BLE001
            last = f"{type(ex).__name__}: {ex}"
            await asyncio.sleep(min(2 ** attempt, 15))
        finally:
            for p in (tmp, tmp.with_suffix(".norm.mp3")):
                if p.exists():
                    p.unlink(missing_ok=True)
    return retries + 1, last


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("out")
    ap.add_argument("--voice", help="voix par defaut")
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--retries", type=int, default=4)
    ap.add_argument("--force", action="store_true", help="ignore le cache")
    ap.add_argument("--no-normalize", action="store_true", help="mp3 brut edge-tts (pas de ffmpeg)")
    a = ap.parse_args()

    items = json.loads(Path(a.manifest).read_text(encoding="utf-8"))
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    normalize = (not a.no_normalize) and bool(FFMPEG)
    keys = set()
    for e in items:
        e.setdefault("voice", a.voice)
        if not e.get("key") or not e.get("text") or not e.get("voice"):
            sys.exit(f"entree invalide (key/text/voice requis) : {e}")
        if e["key"] in keys:
            sys.exit(f"cle dupliquee : {e['key']}")
        keys.add(e["key"])

    cache_path = out / ".tts-cache.json"
    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}
    todo, cached = [], []
    for e in items:
        h = entry_hash(e, normalize)
        if not a.force and cache.get(e["key"]) == h and (out / f"{e['key']}.mp3").exists():
            cached.append(e["key"])
        else:
            todo.append((e, h))

    sem = asyncio.Semaphore(max(1, a.concurrency))
    results = {}
    t0 = time.time()

    async def run(e, h):
        async with sem:
            attempts, err = await synth(e, out, a.retries, normalize)
            results[e["key"]] = (h, attempts, err)
            print(("OK  " if not err else "FAIL"), e["key"], f"(essais: {attempts})", err or "", flush=True)

    await asyncio.gather(*(run(e, h) for e, h in todo))

    failed = {k: v[2] for k, v in results.items() if v[2]}
    for k, (h, _, err) in results.items():
        if not err:
            cache[k] = h
    cache_path.write_text(json.dumps(cache, indent=1), encoding="utf-8")
    report = {
        "total": len(items), "generated": len(results) - len(failed), "cached": len(cached), "failed": failed,
        "normalized": normalize, "seconds": round(time.time() - t0, 1),
    }
    (out / ".tts-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nRapport : {report['total']} entrees | {report['generated']} generees | {report['cached']} en cache | {len(failed)} echecs | {report['seconds']}s")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    asyncio.run(main())
