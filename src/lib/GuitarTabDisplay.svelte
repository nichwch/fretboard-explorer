<script lang="ts">
  import ChordDisplay from './ChordDisplay.svelte'
  import type { Phrase } from './types'

  export let tab: Phrase
</script>

{#each tab as chord}
  <ChordDisplay {chord} />
{/each}

<style></style>
