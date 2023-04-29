<script lang="ts">
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './constants'
  import type { FretMapBlockProps, Tuning } from './types'
  import { writable, type Writable } from 'svelte/store'
  import { FretMapForChord, FretMapForScale } from './guitar'
  import FretMap from './FretMap.svelte'
  import { ScaleType, type NoteName, ChordType, Scale, Note } from 'tonal'
  import { borderRadius, colors, spacing } from '../utils/style-constants'
  import { getContext, setContext } from 'svelte'
  import { flatOrSharp } from './flatOrSharpStore'
  import { fly } from 'svelte/transition'
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
  export let index: number

  let currentPracticeSheet: Writable<PracticeSheet> = getContext(
    'currentPracticeSheet'
  )

  let fretMap = FretMapForScale(tuning, frets, `${root} ${scaleType}`)

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
    let currentPracticeSheetId = $currentPracticeSheet?.id
    if (currentPracticeSheetId !== undefined) {
      let newSheetContents = [...$currentPracticeSheet.sheetContents]
      let currentFretBlock = $currentPracticeSheet.sheetContents[index]
      newSheetContents[index] = {
        ...currentFretBlock,
        frets,
        tuning,
        root,
        mode,
        chordType,
        scaleType,
      }
      db.practice_sheets.update(currentPracticeSheetId, {
        ...$currentPracticeSheet,
        sheetContents: newSheetContents,
      })
    }
  }
</script>

<div
  transition:fly={{ y: -200, duration: 300 }}
  style:border-bottom="1px solid black"
  style:margin-top={spacing[5]}
  style:width="100%"
>
  <!-- controls -->
  <div style:padding={spacing[5]}>
    <select bind:value={mode} style:background-color={colors.red[100]}>
      <option value="chord"> Chord </option>
      <option value="scale"> Scale </option>
    </select>
    <select bind:value={root} style:background-color={colors.blue[100]}>
      {#each allRoots as root}
        <option value={root}>{root}</option>
      {/each}
    </select>
    {#if mode === 'scale'}
      <select
        bind:value={scaleType}
        style:background-color={colors.yellow[100]}
      >
        {#each allScales as { name }}
          <option value={name}>{name}</option>
        {/each}
      </select>
    {:else if mode === 'chord'}
      <select
        bind:value={chordType}
        style:background-color={colors.yellow[100]}
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
  <div style:overflow-x="auto">
    <FretMap {fretMap} {root} {tuning} />
  </div>
</div>

<style>
</style>
