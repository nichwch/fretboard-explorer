<script lang="ts">
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './tunings'
  import type { Tuning } from './types'
  import { FretMapForChord, FretMapForScale } from './guitar'
  import FretMap from './FretMap.svelte'
  import { ScaleType, type NoteName, ChordType, Scale } from 'tonal'
  import { borderRadius, colors, spacing } from '../utils/style-constants'

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
  style:padding={spacing[3]}
  style:background-color={colors.green[200]}
  style:border-radius={borderRadius.lg}
  style:margin-bottom={spacing[5]}
>
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

  <FretMap {fretMap} {root} {tuning} />
</div>

<style>
</style>
