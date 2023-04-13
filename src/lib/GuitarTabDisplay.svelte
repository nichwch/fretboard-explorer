<script lang="ts">
  import ChordDisplay from './ChordDisplay.svelte'
  import type { Phrase } from './types'

  export let tab: Phrase
  console.log('tab', tab)
</script>

{#each tab as chord}
  <ChordDisplay {chord} />
{/each}

<style></style>
