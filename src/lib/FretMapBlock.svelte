<script lang="ts">
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './tunings'
  import type { Tuning } from './types'
  import {
    FretMapForChord,
    FretMapForScale,
    GetFretMapGivenNotes,
  } from './guitar'
  import FretMap from './FretMap.svelte'
  import { ScaleType, type NoteName, ChordType, Scale } from 'tonal'

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

  $: {
    console.log(mode, root, chordType, scaleType, fretMap)
    if (mode === 'scale') {
      let scaleName = `${root} ${scaleType}`
      fretMap = FretMapForScale(tuning, frets, scaleName)
    } else if (mode === 'chord') {
      let chordName = `${root} ${chordType}`
      fretMap = FretMapForChord(tuning, frets, chordName)
    }
  }
</script>

<div>
  <!-- controls -->
  <div>
    <select bind:value={mode}>
      <option value="chord"> Chord </option>
      <option value="scale"> Scale </option>
    </select>
    <select bind:value={root}>
      {#each allRoots as root}
        <option value={root}>{root}</option>
      {/each}
    </select>
    {#if mode === 'scale'}
      <select bind:value={scaleType}>
        {#each allScales as { name }}
          <option value={name}>{name}</option>
        {/each}
      </select>
    {:else if mode === 'chord'}
      <select bind:value={chordType}>
        {#each allChords as { name }}
          <option value={name}>{name}</option>
        {/each}
      </select>
    {/if}
  </div>

  <FretMap {fretMap} {root} {tuning} />
</div>

<style>
</style>
