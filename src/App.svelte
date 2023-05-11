<script lang="ts">
  import { borderRadius, colors, sizes, spacing } from './utils/style-constants'
  import { db } from './lib/db'
  import { liveQuery } from 'dexie'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import PracticeSheetSidebar from './lib/PracticeSheetSidebar.svelte'
  import MainContent from './lib/MainContent.svelte'
  import Metronome from './lib/Metronome.svelte'
  import { flatOrSharp } from './lib/flatOrSharpStore'

  db.open()
  let currentPracticeSheetId = writable<string | null>(null)

  $: currentPracticeSheet = liveQuery(async () => {
    const res = await db.practice_sheets.get($currentPracticeSheetId)
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
      style:display="flex"
      style:align-items="center"
    >
      <span style:font-weight="bold">fretboard explorer</span>
      <span style:margin-left={spacing[3]}><a href="/#/about">about</a></span>
      <div
        style:margin-left="auto"
        style:display="flex"
        style:align-items="center"
      >
        <span style:margin-right={spacing[3]} style:display="flex">
          <button
            style:border={`2px solid ${colors.green[600]}`}
            style:background-color={$flatOrSharp === '#'
              ? colors.green[600]
              : colors.green[400]}
            style:padding={spacing[1.5]}
            style:margin-right={0}
            style:border-top-left-radius={borderRadius.md}
            style:border-bottom-left-radius={borderRadius.md}
            style:font-weight="bold"
            on:click={() => {
              flatOrSharp.set('#')
            }}>#</button
          >
          <button
            style:border={`2px solid ${colors.green[600]}`}
            style:border-left="none"
            style:background-color={$flatOrSharp === 'b'
              ? colors.green[600]
              : colors.green[400]}
            style:margin-left={0}
            style:padding={spacing[1.5]}
            style:border-top-right-radius={borderRadius.md}
            style:border-bottom-right-radius={borderRadius.md}
            style:font-weight="bold"
            on:click={() => {
              flatOrSharp.set('b')
            }}>b</button
          >
        </span>
        <!-- <Metronome /> -->
      </div>
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
