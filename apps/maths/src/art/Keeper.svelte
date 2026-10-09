<script lang="ts">
  // Gardien de but : Player avec gants et pose "attente" par defaut (poses utiles : attente, plongeon, celebration, decu).
  import Player from './Player.svelte';
  let props: Record<string, any> = $props();
</script>

<Player role="gardien" pose="attente" {...props} />
