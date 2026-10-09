/** Dossier des voix generees (public/audio/es/<cle>.mp3 + <cle>.lento.mp3). */
export const AUDIO_BASE = `${import.meta.env?.BASE_URL ?? '/espagnol/'}audio/es/`;
export const audioUrl = (key: string) => `${AUDIO_BASE}${key}.mp3`;
export const lentoKey = (key: string) => `${key}.lento`;
