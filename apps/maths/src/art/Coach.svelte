<script lang="ts">
  // Coach adulte (casquette, moustache, sifflet) pour les videos de strategie. Pose par defaut : "explique".
  import Player from './Player.svelte';
  let props: Record<string, any> = $props();
</script>

<Player role="coach" pose="explique" primary="#1B6BFF" secondary="#FFFFFF" hairColor={4} {...props} />
