<script lang="ts">
  import { getContext, tick } from 'svelte'
  import {
    borderRadius,
    colors,
    sizes,
    spacing,
    typography,
  } from '../utils/style-constants'
  import type { Writable } from 'svelte/store'
  import { liveQuery } from 'dexie'
  import { db } from './db'
  import { defaultFretMapBlockProps, type FretMapBlockProps } from './types'
  import FretMapBlock from './FretMapBlock.svelte'
  import Welcome from './Welcome.svelte'
  import { nanoid } from 'nanoid'
  import { afterUpdate } from 'svelte'

  let scrollContainer
  let newestBlockId = null
  const currentPracticeSheetId: Writable<string> = getContext(
    'currentPracticeSheetId'
  )

  $: currentPracticeSheet = liveQuery(async () => {
    const res = await db.practice_sheets.get($currentPracticeSheetId)
    return res
  })

  $: sheetContents = $currentPracticeSheet?.sheetContents
  $: sheetName = $currentPracticeSheet?.name

  const createFretBoard = async () => {
    const newId = nanoid()
    db.practice_sheets.update($currentPracticeSheetId, {
      ...$currentPracticeSheet,
      sheetContents: [
        ...sheetContents,
        {
          id: newId,
          ...defaultFretMapBlockProps,
        } as FretMapBlockProps,
      ],
    })
    newestBlockId = newId
  }

  afterUpdate(() => {
    const newBlock = document.getElementById(newestBlockId)
    if (newBlock && newestBlockId !== null) {
      newBlock.scrollIntoView({ behavior: 'smooth' })
      newestBlockId = null
    }
  })

  const deletePracticeSheet = () => {
    db.practice_sheets.delete($currentPracticeSheetId)
    currentPracticeSheetId.set(null)
  }
</script>

{#if $currentPracticeSheetId}
  <div
    style:display="flex"
    style:align-items="center"
    style:padding={spacing[3]}
    style:border-bottom="1px solid black"
  >
    <input
      placeholder="untitled"
      spellcheck="false"
      id="titleInput"
      style:font-size={typography.fontSizes['3xl']}
      style:font-weight="bold"
      style:flex-shrink="0"
      style:color="inherit"
      style:display="inline"
      style:min-width={sizes.xs}
      value={sheetName}
      on:input={(event) => {
        db.practice_sheets.update($currentPracticeSheetId, {
          ...$currentPracticeSheet,
          //@ts-ignore
          name: event.target.value,
        })
      }}
    />
    <button
      class="newFretBoardButton"
      style:border="none"
      style:font-size={typography.fontSizes['lg']}
      style:padding={spacing[3]}
      style:margin={spacing[3]}
      style:border-radius={borderRadius.lg}
      style:color={colors.blue[700]}
      style:font-weight="bold"
      on:click={createFretBoard}
    >
      add fretboard
    </button>
    <button
      class="deletePracticeSheetButton"
      style:border="none"
      style:font-size={typography.fontSizes['lg']}
      style:padding={spacing[3]}
      style:margin={spacing[3]}
      style:border-radius={borderRadius.lg}
      style:color={colors.red[700]}
      style:font-weight="bold"
      on:click={deletePracticeSheet}
    >
      delete practice sheet
    </button>
  </div>

  <div style:overflow-y="auto" bind:this={scrollContainer}>
    {#if sheetContents?.length === 0}
      <div style:padding={spacing[10]}>
        <p>No fretboards yet. Add one by pressing 'Add Fretboard'</p>
      </div>
    {:else if sheetContents === undefined}
      <div />
    {:else}
      {#each sheetContents as fretMapBlock, index (fretMapBlock.id)}
        <!-- bind last element to lastBlock -->
        <FretMapBlock {...fretMapBlock} {index} />
      {/each}
    {/if}
  </div>
{:else}
  <Welcome />
{/if}

<style>
  .newFretBoardButton {
    background-color: #90cdf4;
    transition: background-color 0.3s;
  }
  .newFretBoardButton:hover {
    background-color: #63b3ed;
  }

  .deletePracticeSheetButton {
    background-color: #ff8a8a;
    transition: background-color 0.3s;
  }
  .deletePracticeSheetButton:hover {
    background-color: #ff5c5c;
  }

  #titleInput {
    border: none;
    background-color: transparent;
    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 1rem;
  }

  #titleInput:focus {
    outline: 1px solid black;
  }
</style>
