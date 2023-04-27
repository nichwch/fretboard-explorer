<script lang="ts">
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './tunings'
  import type { Tuning } from './types'
  import { writable } from 'svelte/store'
  import { FretMapForChord, FretMapForScale } from './guitar'
  import FretMap from './FretMap.svelte'
  import { ScaleType, type NoteName, ChordType, Scale } from 'tonal'
  import { borderRadius, colors, spacing } from '../utils/style-constants'
  import { setContext } from 'svelte'

  export let stringSpacing = 25
  export let fretSpacing = 50

  let frets: number = GUITAR_STANDARD_FRETS
  let tuning: Tuning = GUITAR_STANDARD_TUNING

  let root: NoteName | null = 'G'
  let mode: 'scale' | 'chord' = 'scale'
  let chordType: string | null = 'major'
  let scaleType: string | null = 'major'
  let fretMap = FretMapForScale(tuning, frets, `${root} ${scaleType}`)

  let allScales = ScaleType.all()
  let allChords = ChordType.all()
  let allRoots = Scale.get('A chromatic').notes

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
    console.log(mode, root, chordType, scaleType, fretMap)
  }
</script>

<div
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
