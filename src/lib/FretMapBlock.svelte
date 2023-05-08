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
  export let overlayMode: 'scale' | 'chord' = 'scale'
  export let overlayChordType: string | null = 'major'
  export let overlayScaleType: string | null = 'major'

  export let index: number
  export let id: string

  let currentPracticeSheetId: Writable<string | null> = getContext(
    'currentPracticeSheetId'
  )
  $: {
    console.log('currentPracticeSheetId2', $currentPracticeSheetId)
  }
  let currentPracticeSheet: Observable<PracticeSheet> = getContext(
    'currentPracticeSheet'
  )

  let fretMap = FretMapForScale(tuning, frets, `${root} ${scaleType}`)

  let overlayFretMap

  let allScales = ScaleType.all()
  let allChords = ChordType.all()
  let allRoots = Scale.get('A chromatic').notes.map((note) => {
    if ($flatOrSharp !== Note.get(note).acc) {
      return Note.enharmonic(note)
    } else {
      return note
    }
  })

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
      }
      newSheet[index] = newBlock
      console.log('new sheet update', newSheet)
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
  style:margin-top={spacing[5]}
  style:width="100%"
>
  <!-- controls -->
  <div style:padding={spacing[5]}>
    <select
      bind:value={mode}
      style:background-color={colors.red[100]}
      on:change={updateSheets}
    >
      <option value="chord"> Chord </option>
      <option value="scale"> Scale </option>
    </select>
    <select
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
    <button on:click={deleteFretBoard}>delete </button>
    <!-- TODO: change this to be "if overlay" -->
    {#if true}
      <div style:padding={spacing[5]}>
        <select
          bind:value={overlayMode}
          style:background-color={colors.red[100]}
          on:change={updateSheets}
        >
          <option value="chord"> Chord </option>
          <option value="scale"> Scale </option>
        </select>
        <select
          bind:value={overlayRoot}
          style:background-color={colors.blue[100]}
          on:change={updateSheets}
        >
          {#each allRoots as root}
            <option value={root}>{root}</option>
          {/each}
        </select>
        {#if overlayMode === 'scale'}
          <select
            bind:value={overlayScaleType}
            style:background-color={colors.yellow[100]}
            on:change={updateSheets}
          >
            {#each allScales as { name }}
              <option value={name}>{name}</option>
            {/each}
          </select>
        {:else if overlayMode === 'chord'}
          <select
            bind:value={overlayChordType}
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
      </div>
    {/if}
  </div>
  <div style:overflow-x="auto">
    <FretMap {fretMap} {root} {tuning} {overlayFretMap} {overlayRoot} />
  </div>
</div>

<style>
</style>
