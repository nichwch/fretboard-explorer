<script lang="ts">
  import {
    borderRadius,
    colors,
    sizes,
    spacing,
    typography,
  } from './utils/style-constants'
  import FretMapBlock from './lib/FretMapBlock.svelte'
  import { db, type PracticeSheet } from './lib/db'
  import { liveQuery } from 'dexie'
  import { nanoid } from 'nanoid'
  import { fly } from 'svelte/transition'
  import { defaultFretMapBlockProps } from './lib/types'
  import { setContext } from 'svelte'
  import { readable, writable, type Readable } from 'svelte/store'

  let currentPracticeSheetId = writable<string | null>(null)
  const allPracticeSheets = liveQuery(() =>
    db.practice_sheets.orderBy('creation_date').reverse().toArray()
  )

  $: currentPracticeSheet = liveQuery(async () => {
    const res = await db.practice_sheets.get($currentPracticeSheetId)
    console.log('query id', $currentPracticeSheetId, res)
    return res
  })

  setContext('currentPracticeSheetId', currentPracticeSheetId)

  const createPracticeSheet = () => {
    const newId = nanoid()
    db.practice_sheets.add({
      name: 'new practice sheet',
      id: newId,
      sheetContents: [],
      creation_date: new Date(),
    })
  }

  const createFretBoard = () => {
    db.practice_sheets.update($currentPracticeSheetId, {
      ...$currentPracticeSheet,
      sheetContents: [
        ...$currentPracticeSheet.sheetContents,
        defaultFretMapBlockProps,
      ],
    })
  }

  $: console.log(
    $allPracticeSheets,
    $currentPracticeSheetId,
    $currentPracticeSheet
  )
</script>

<main style:height="100%">
  <div id="main">
    <div
      id="topNav"
      style:padding={spacing[3]}
      style:background-color={colors.green[300]}
      style:border-bottom={`1px solid black`}
    >
      <span style:font-weight="bold">guitar tools</span>
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
        <div
          style:overflow-y="auto"
          style:height="100%"
          style:padding={spacing[3]}
          style:box-sizing="border-box"
          style:flex-grow="0"
          style:flex-shrink="0"
        >
          <button
            id="newPracticeSheetButton"
            style:border="none"
            style:width="100%"
            style:font-size={typography.fontSizes['lg']}
            style:padding={spacing[3]}
            style:border-radius={borderRadius.lg}
            style:color={colors.blue[700]}
            style:font-weight="bold"
            on:click={createPracticeSheet}
          >
            new practice sheet
          </button>
          {#if allPracticeSheets}
            {#each $allPracticeSheets || [] as practiceSheet (practiceSheet.id)}
              <button
                class:selected={$currentPracticeSheetId === practiceSheet.id}
                class="practiceSheetButton"
                transition:fly={{ y: 50, duration: 400 }}
                style:box-sizing="border-box"
                style:width="100%"
                style:font-size={typography.fontSizes['md']}
                style:padding={spacing[3]}
                style:margin-top={spacing[3]}
                style:border-radius={borderRadius.lg}
                on:click={() => {
                  console.log('CLICKED', practiceSheet.id)
                  $currentPracticeSheetId = practiceSheet.id
                }}
              >
                {practiceSheet.name}
              </button>
            {/each}
          {/if}
        </div>
      </div>
      <div
        style:display="flex"
        style:flex-direction="column"
        style:height="100%"
        style:flex-grow="1"
      >
        {#if $currentPracticeSheetId}
          <div style:padding={spacing[5]} style:border-bottom="1px solid black">
            <h1 style:margin="0px" style:display="inline-block">
              {$currentPracticeSheet?.name}
            </h1>
            <button
              id="newFretBoardButton"
              style:border="none"
              style:font-size={typography.fontSizes['lg']}
              style:padding={spacing[3]}
              style:margin={spacing[3]}
              style:border-radius={borderRadius.lg}
              style:color={colors.red[700]}
              style:font-weight="bold"
              on:click={createFretBoard}
            >
              add fretboard
            </button>
          </div>

          <div style:overflow-y="auto">
            {#each $currentPracticeSheet?.sheetContents || [] as fretMapBlock, index (index + $currentPracticeSheetId)}
              <FretMapBlock {...fretMapBlock} {index} />
            {/each}
          </div>
        {/if}
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

  #newPracticeSheetButton {
    background-color: #90cdf4;
    transition: background-color 0.3s;
  }
  #newPracticeSheetButton:hover {
    background-color: #63b3ed;
  }

  .practiceSheetButton {
    background-color: transparent;
    border: none;
    transition: background-color 0.3s;
  }

  .practiceSheetButton:hover {
    background-color: #bee3f8;
  }

  .practiceSheetButton.selected {
    background-color: #bee3f8;
  }

  #newFretBoardButton {
    background-color: #ffb8b8;
    transition: background-color 0.3s;
  }
  #newFretBoardButton:hover {
    background-color: #ff8a8a;
  }
</style>
