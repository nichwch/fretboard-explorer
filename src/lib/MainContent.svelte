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

  let lastBlock
  const currentPracticeSheetId: Writable<string> = getContext(
    'currentPracticeSheetId'
  )

  $: currentPracticeSheet = liveQuery(async () => {
    const res = await db.practice_sheets.get($currentPracticeSheetId)
    console.log('query id', $currentPracticeSheetId, res)
    return res
  })

  const createFretBoard = async () => {
    await db.practice_sheets.update($currentPracticeSheetId, {
      ...$currentPracticeSheet,
      sheetContents: [
        ...$currentPracticeSheet.sheetContents,
        {
          id: nanoid(),
          ...defaultFretMapBlockProps,
        } as FretMapBlockProps,
      ],
    })
    await tick()
    console.log('LAST BLOCK', lastBlock)
    lastBlock.scrollIntoView({ behavior: 'smooth' })
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
      style:min-width={sizes.md}
      value={$currentPracticeSheet?.name}
      on:input={(event) => {
        //@ts-ignore
        console.log('change?', event.target.value)
        db.practice_sheets.update($currentPracticeSheetId, {
          ...$currentPracticeSheet,
          //@ts-ignore
          name: event.target.value,
        })
      }}
    />
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
    {#each $currentPracticeSheet?.sheetContents || [] as fretMapBlock, index (fretMapBlock.id)}
      <!-- bind last element to lastBlock -->
      {#if index === $currentPracticeSheet?.sheetContents.length - 1}
        <FretMapBlock {...fretMapBlock} {index} bind:this={lastBlock} />
      {:else}
        <FretMapBlock {...fretMapBlock} {index} />
      {/if}
    {/each}
    {#if $currentPracticeSheet?.sheetContents.length === 0}
      <div style:padding={spacing[10]}>
        <p>No fretboards yet. Add one by pressing 'Add Fretboard'</p>
      </div>
    {/if}
  </div>
{:else}
  <Welcome />
{/if}

<style>
  #newFretBoardButton {
    background-color: #ffb8b8;
    transition: background-color 0.3s;
  }
  #newFretBoardButton:hover {
    background-color: #ff8a8a;
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
