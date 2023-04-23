<script lang="ts">
  import { FretMapForChord, FretMapForScale } from './lib/guitar'
  import FretMap from './lib/FretMap.svelte'
  import GuitarTabDisplay from './lib/GuitarTabDisplay.svelte'
  import Counter from './lib/GuitarTabDisplay.svelte'
  import { BASS_STANDARD_TUNING, GUITAR_STANDARD_TUNING } from './lib/tunings'
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
  // const tabMapTest = FretMapForScale(BASS_STANDARD_TUNING, 24, 'B minor')
  const tabMapTest = FretMapForChord(GUITAR_STANDARD_TUNING, 24, 'Bm')
  console.log(tabMapTest)
</script>

<main>
  <div id="main">
    <h1>Guitar tools</h1>
    <p>
      Practicing svelte by creating some tools to help with guitar practice.
    </p>
    <FretMap fretMap={tabMapTest} root="B" tuning={GUITAR_STANDARD_TUNING} />
  </div>
</main>

<style>
  #main {
    width: 350px;
    margin: auto;
    margin-top: 100px;
  }
</style>
