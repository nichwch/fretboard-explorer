<script lang="ts">
  import { noteByStringAndFret as pcByStringAndFret } from './guitar'
  import { hoveredNote as hoveredPC } from './hoveredNoteStore'
  import type { FretMap, Tuning } from './types'

  export let stringIndex: number
  export let fretIndex: number
  export let fretMap: FretMap
  export let tuning: Tuning
  export let root: string

  function fretPressedInFretMap(string: number, fret: number) {
    return fretMap[string].includes(fret)
  }

  function isRoot(string: number, fret: number) {
    const note = pcByStringAndFret(tuning, string, fret)
    return note === root
  }
</script>

<!-- hover target -->

{#if fretPressedInFretMap(stringIndex, fretIndex + 1)}
  <circle
    cx={50 * fretIndex + 75}
    cy={stringIndex * 25}
    r="10"
    fill={isRoot(stringIndex, fretIndex + 1) ? 'black' : 'white'}
    stroke="black"
    stroke-dasharray={$hoveredPC ===
      pcByStringAndFret(tuning, stringIndex, fretIndex + 1) &&
    !isRoot(stringIndex, fretIndex + 1)
      ? '4,4'
      : '0'}
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
    {pcByStringAndFret(tuning, stringIndex, fretIndex + 1)}
  </text>
{:else if $hoveredPC === pcByStringAndFret(tuning, stringIndex, fretIndex + 1)}
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
    {pcByStringAndFret(tuning, stringIndex, fretIndex + 1)}
  </text>
{/if}
<circle
  cx={50 * fretIndex + 75}
  cy={stringIndex * 25}
  r="10"
  fill="transparent"
  on:mouseenter={() => {
    hoveredPC.set(pcByStringAndFret(tuning, stringIndex, fretIndex + 1))
  }}
  on:mouseleave={() => {
    hoveredPC.set(null)
  }}
/>
