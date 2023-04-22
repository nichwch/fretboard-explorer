<script lang="ts">
  import { noteByStringAndFret } from '../guitar'
  import type { FretMap, Tuning } from './types'
  import { type NoteWithOctave } from 'tonal'

  export let stringIndex: number
  export let fretIndex: number
  export let fretMap: FretMap
  export let tuning: Tuning
  export let root: NoteWithOctave

  function fretPressedInFretMap(string: number, fret: number) {
    return fretMap[string].includes(fret)
  }

  function isRoot(string: number, fret: number) {
    const note = noteByStringAndFret(tuning, string, fret)
    return note === root
  }
</script>

{#if fretPressedInFretMap(stringIndex, fretIndex + 1)}
  <circle
    cx={50 * fretIndex + 75}
    cy={stringIndex * 25}
    r="10"
    fill={isRoot(stringIndex, fretIndex + 1) ? 'black' : 'white'}
    stroke="black"
  />
  <text
    data-v-6d8a98b6=""
    font-size="11"
    x={50 * fretIndex + 75}
    y={stringIndex * 25}
    dominant-baseline="central"
    fill={isRoot(stringIndex, fretIndex + 1) ? 'white' : 'black'}
    font-weight="normal"
    text-anchor="middle"
  >
    {noteByStringAndFret(tuning, stringIndex, fretIndex + 1)}
  </text>
{:else}
  <!-- show this only on hover -->
  <circle cx={50 * fretIndex + 75} cy={stringIndex * 25} r="10" fill="white" />
  <text
    data-v-6d8a98b6=""
    font-size="11"
    x={50 * fretIndex + 75}
    y={stringIndex * 25}
    dominant-baseline="central"
    fill={isRoot(stringIndex, fretIndex + 1) ? 'white' : 'black'}
    font-weight="normal"
    text-anchor="middle"
  >
    {noteByStringAndFret(tuning, stringIndex, fretIndex + 1)}
  </text>
{/if}
