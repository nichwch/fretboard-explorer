<script lang="ts">
  import { colors, sizes, spacing } from './utils/style-constants'
  import { db } from './lib/db'
  import { liveQuery } from 'dexie'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import PracticeSheetSidebar from './lib/PracticeSheetSidebar.svelte'
  import MainContent from './lib/MainContent.svelte'
  import Metronome from './lib/Metronome.svelte'

  let currentPracticeSheetId = writable<string | null>(null)

  $: currentPracticeSheet = liveQuery(async () => {
    const res = await db.practice_sheets.get($currentPracticeSheetId)
    console.log('query id', $currentPracticeSheetId, res)
    return res
  })

  let currentPracticeSheetStore = writable($currentPracticeSheet)
  $: currentPracticeSheetStore.set($currentPracticeSheet)

  setContext('currentPracticeSheetId', currentPracticeSheetId)
  setContext('currentPracticeSheet', currentPracticeSheetStore)
</script>

<main style:height="100%">
  <div id="main">
    <div
      id="topNav"
      style:padding={spacing[3]}
      style:background-color={colors.green[300]}
      style:border-bottom={`1px solid black`}
      style:align-items="center"
    >
      <span style:font-weight="bold">guitar tools</span>
      <Metronome />
    </div>
    <div id="beneathNav">
      <!-- main -->
      <div
        style:border-right={`1px solid black`}
        style:flex-basis={sizes['2xs']}
        style:flex-grow="0"
        style:flex-shrink="0"
      >
        <!-- sidebar -->
        <PracticeSheetSidebar />
      </div>
      <div
        style:display="flex"
        style:flex-direction="column"
        style:height="100%"
        style:flex-grow="1"
      >
        <MainContent />
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
    flex-grow: 1;
    /* stupidest css hack ever but neccessary for scrolling to work here */
    height: 1px;
  }
</style>
