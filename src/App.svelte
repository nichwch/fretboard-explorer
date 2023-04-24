<script lang="ts">
  import { FretMapForChord, FretMapForScale } from './lib/guitar'
  import FretMap from './lib/FretMap.svelte'
  import GuitarTabDisplay from './lib/GuitarTabDisplay.svelte'
  import Counter from './lib/GuitarTabDisplay.svelte'
  import { BASS_STANDARD_TUNING, GUITAR_STANDARD_TUNING } from './lib/tunings'
  import type { Phrase } from './lib/types'
  import { colors, spacing } from './utils/style-constants'

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

<main style:background-color={colors.green[100]}>
  <div id="main">
    <div
      id="topNav"
      style:padding={spacing[3]}
      style:border-bottom={`1px solid black`}
    >
      <span style:font-weight="bold">guitar tools</span>
    </div>
    <div id="beneathNav">
      <!-- main -->
      <div
        id="sideNav"
        style:padding={spacing[3]}
        style:border-right={`1px solid black`}
      >
        sidenav
      </div>
      <div id="contentContainer">
        <h1>Guitar tools</h1>
        <p>
          Practicing svelte by creating some tools to help with guitar practice.
        </p>
        <FretMap
          fretMap={tabMapTest}
          root="B"
          tuning={GUITAR_STANDARD_TUNING}
        />
      </div>
    </div>
  </div>
</main>

<style>
  #main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  #topNav {
    display: flex;
  }

  #beneathNav {
    display: flex;
  }
</style>
