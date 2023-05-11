<script lang="ts">
  import { nanoid } from 'nanoid'
  import {
    borderRadius,
    colors,
    spacing,
    typography,
  } from '../utils/style-constants'
  import { db } from './db'
  import { liveQuery } from 'dexie'
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import { fly } from 'svelte/transition'

  const currentPracticeSheetId: Writable<string> = getContext(
    'currentPracticeSheetId'
  )
  const createPracticeSheet = () => {
    const newId = nanoid()
    db.practice_sheets.add({
      name: 'new practice sheet',
      id: newId,
      sheetContents: [],
      creation_date: new Date(),
    })
  }

  const allPracticeSheets = liveQuery(() =>
    db.practice_sheets.orderBy('creation_date').reverse().toArray()
  )
</script>

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
          $currentPracticeSheetId = practiceSheet.id
        }}
      >
        {#if practiceSheet.name.length > 0}
          {practiceSheet.name}
        {:else}
          {'untitled'}
        {/if}
      </button>
    {/each}
  {/if}
</div>

<style>
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
</style>
