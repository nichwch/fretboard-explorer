<script lang="ts">
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './constants'
  import {
    defaultFretMapBlockProps,
    type FretMapBlockProps,
    type Tuning,
  } from './types'
  import { get, writable, type Writable } from 'svelte/store'
  import { FretMapForChord, FretMapForScale } from './guitar'
  import FretMap from './FretMap.svelte'
  import { ScaleType, type NoteName, ChordType, Scale, Note } from 'tonal'
  import { borderRadius, colors, spacing } from '../utils/style-constants'
  import { getContext, onMount, setContext } from 'svelte'
  import { flatOrSharp } from './flatOrSharpStore'
  import { fade, fly } from 'svelte/transition'
  import { db, type PracticeSheet } from './db'
  import type { Observable } from 'dexie'

  export let stringSpacing = 25
  export let fretSpacing = 50

  export let frets: number = GUITAR_STANDARD_FRETS
  export let tuning: Tuning = GUITAR_STANDARD_TUNING

  export let root: NoteName | null = 'G'
  export let mode: 'scale' | 'chord' = 'scale'
  export let chordType: string | null = 'major'
  export let scaleType: string | null = 'major'

  export let overlayRoot: NoteName | null = 'G'
  export let overlayMode: 'scale' | 'chord' | null = null
  export let overlayChordType: string | null = 'major'
  export let overlayScaleType: string | null = 'major'

  export let index: number
  export let id: string
  export let notes: string | null = null

  let currentPracticeSheetId: Writable<string | null> = getContext(
    'currentPracticeSheetId'
  )
  let currentPracticeSheet: Observable<PracticeSheet> = getContext(
    'currentPracticeSheet'
  )
  $: console.log('currentPracticeSheet', $currentPracticeSheet)

  let fretMap = FretMapForScale(tuning, frets, `${root} ${scaleType}`)

  let overlayFretMap

  let allScales = ScaleType.all()
  let allChords = ChordType.all()
  $: allRoots = Scale.get('A chromatic').notes.map((note) => {
    if ($flatOrSharp !== Note.get(note).acc) {
      return Note.enharmonic(note)
    } else {
      return note
    }
  })

  $: {
    let note = Note.get(root)
    if ($flatOrSharp !== note.acc) {
      root = Note.enharmonic(note.name)
    } else {
      root = note.name
    }
  }

  $: {
    let note = Note.get(overlayRoot)
    if ($flatOrSharp !== note.acc) {
      overlayRoot = Note.enharmonic(note.name)
    } else {
      overlayRoot = note.name
    }
  }

  let fretMapHoveredNote = writable<NoteName | null>(null)
  setContext('fretMapHoveredNote', fretMapHoveredNote)
  setContext('stringSpacing', stringSpacing)
  setContext('fretSpacing', fretSpacing)

  $: sheetContents = $currentPracticeSheet?.sheetContents

  $: {
    if (mode === 'scale') {
      let scaleName = `${root} ${scaleType}`
      fretMap = FretMapForScale(tuning, frets, scaleName)
    } else if (mode === 'chord') {
      let chordName = `${root} ${chordType}`
      fretMap = FretMapForChord(tuning, frets, chordName)
    }
  }

  $: {
    if (overlayMode === 'scale') {
      let overlayScaleName = `${overlayRoot} ${overlayScaleType}`
      overlayFretMap = FretMapForScale(tuning, frets, overlayScaleName)
    } else if (overlayMode === 'chord') {
      let overlayChordName = `${overlayRoot} ${overlayChordType}`
      overlayFretMap = FretMapForChord(tuning, frets, overlayChordName)
    } else if (overlayMode === null) {
      overlayFretMap = null
    }
  }

  const updateSheets = () => {
    if ($currentPracticeSheet) {
      let newSheet = [...sheetContents]
      let newBlock = {
        ...defaultFretMapBlockProps,
        ...newSheet[index],
        frets,
        tuning,
        root,
        mode,
        chordType,
        scaleType,
        overlayRoot,
        overlayMode,
        overlayChordType,
        overlayScaleType,
        notes,
      }
      newSheet[index] = newBlock
      db.practice_sheets.update($currentPracticeSheetId, {
        sheetContents: newSheet,
      })
    }
  }

  const deleteFretBoard = async () => {
    const newSheetContents = sheetContents.filter((block) => block.id !== id)
    db.practice_sheets.update($currentPracticeSheetId, {
      ...$currentPracticeSheet,
      sheetContents: newSheetContents,
    })
  }
</script>

<div
  {id}
  transition:fade
  style:border-bottom="1px solid black"
  style:width="100%"
>
  <!-- controls -->
  <div>
    <div style:display="flex" style:background-color={colors.gray[100]}>
      <select
        class="mainControlSelect"
        bind:value={mode}
        style:background-color={colors.red[100]}
        on:change={updateSheets}
      >
        <option value="chord"> Chord </option>
        <option value="scale"> Scale </option>
      </select>
      <select
        class="mainControlSelect"
        bind:value={root}
        style:background-color={colors.blue[100]}
        on:change={updateSheets}
      >
        {#each allRoots as root}
          <option value={root}>{root}</option>
        {/each}
      </select>
      {#if mode === 'scale'}
        <select
          class="mainControlSelect"
          bind:value={scaleType}
          style:background-color={colors.yellow[100]}
          on:change={updateSheets}
        >
          {#each allScales as { name }}
            <option value={name}>{name}</option>
          {/each}
        </select>
      {:else if mode === 'chord'}
        <select
          class="mainControlSelect"
          bind:value={chordType}
          style:background-color={colors.yellow[100]}
          on:change={updateSheets}
        >
          {#each allChords as xChordType}
            <!-- some chords do not have proper names and can only be identified 
        by their aliases
        -->
            <option value={xChordType.name || xChordType?.aliases?.[0]}
              >{xChordType.name || xChordType?.aliases?.[0]}</option
            >
          {/each}
        </select>
      {/if}
      <!-- overlay controls -->
      {#if overlayMode == null}
        <div>
          <button
            style:padding={spacing[1.5]}
            style:border-right="1px solid black"
            class="overlayButton"
            on:click={() => {
              overlayMode = 'chord'
              overlayRoot = root
              updateSheets()
            }}>add overlay</button
          >
        </div>
      {:else}
        <select
          class="mainControlSelect"
          bind:value={overlayMode}
          style:background-color={colors.gray[200]}
          on:change={updateSheets}
        >
          <option value="chord"> Chord </option>
          <option value="scale"> Scale </option>
        </select>
        <select
          class="mainControlSelect"
          bind:value={overlayRoot}
          style:background-color={colors.gray[200]}
          on:change={updateSheets}
        >
          {#each allRoots as root}
            <option value={root}>{root}</option>
          {/each}
        </select>
        {#if overlayMode === 'scale'}
          <select
            class="mainControlSelect"
            bind:value={overlayScaleType}
            style:background-color={colors.gray[200]}
            on:change={updateSheets}
          >
            {#each allScales as { name }}
              <option value={name}>{name}</option>
            {/each}
          </select>
        {:else if overlayMode === 'chord'}
          <select
            class="mainControlSelect"
            bind:value={overlayChordType}
            style:background-color={colors.gray[200]}
            on:change={updateSheets}
          >
            {#each allChords as xChordType}
              <!-- some chords do not have proper names and can only be identified 
        by their aliases
        -->
              <option value={xChordType.name || xChordType?.aliases?.[0]}
                >{xChordType.name || xChordType?.aliases?.[0]}</option
              >
            {/each}
          </select>
        {/if}
        <button
          style:padding={spacing[1.5]}
          style:border-right="1px solid black"
          class="removeOverlayButton"
          on:click={() => {
            overlayMode = null
            updateSheets()
          }}>remove overlay</button
        >
      {/if}
      <!-- delete button -->
      <button
        style:margin-left="auto"
        class="deleteButton"
        style:padding={spacing[1.5]}
        style:color={colors.red[900]}
        on:click={deleteFretBoard}
        >delete
      </button>
    </div>
  </div>
  <div
    style:overflow-x="auto"
    style:display="flex"
    style:align-items="center"
    style:border-top="1px solid black"
  >
    <FretMap {fretMap} {root} {tuning} {overlayFretMap} {overlayRoot} />

    <textarea
      bind:value={notes}
      on:change={updateSheets}
      class="fretboardNotes"
      style:padding={spacing[3]}
      style:margin-left={spacing[3]}
      style:border="none"
      style:border-left="1px solid black"
      style:resize="none"
      style:font-family="inherit"
      style:height="150px"
      placeholder="write notes here..."
      style:flex-grow="1"
      spellcheck="false"
    />
  </div>
</div>

<style>
  .deleteButton {
    border: none;
    border-left: 1px solid black;
    background-color: #ff8a8a;
    float: right;
  }

  .deleteButton:hover {
    background-color: #ff5c5c;
  }

  .overlayButton {
    border: none;
    background-color: #e2e8f0;
  }

  .overlayButton:hover {
    background-color: #cbd5e0;
  }

  .removeOverlayButton {
    border: none;
    background-color: #e2e8f0;
  }

  .removeOverlayButton:hover {
    background-color: #cbd5e0;
  }

  .fretboardNotes:focus {
    outline: none;
    background-color: #edf2f7;
  }

  .mainControlSelect {
    border: none;
    border-right: 1px solid black;
  }
</style>
