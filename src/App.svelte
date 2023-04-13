<script lang="ts">
  import GuitarTabDisplay from './lib/GuitarTabDisplay.svelte'
  import Counter from './lib/GuitarTabDisplay.svelte'
  import type { Phrase } from './lib/types'

  // tasty little pentatonic lick
  let testTab: Phrase = [
    [5, 0, 0, 0, 0, 0],
    [8, 0, 0, 0, 0, 0],
    [0, 5, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 0],
    [0, 0, 7, 0, 0, 0],
  ]
  console.log('Testtab,', testTab)
</script>

<main>
  <div id="main">
    <GuitarTabDisplay tab={testTab} />
  </div>
</main>

<style>
  #main {
    width: 350px;
    margin: auto;
    margin-top: 100px;
  }
</style>
