<script lang="ts">
  import { STANDARD_TUNING, noteByStringAndFret } from '../guitar'
  import NoteCircle from './NoteCircle.svelte'
  import type { FretMap, Phrase, Tuning } from './types'
  import { type NoteWithOctave } from 'tonal'

  export let fretMap: FretMap
  export let frets: number = 22
  export let tuning: Tuning = STANDARD_TUNING
  export let root: NoteWithOctave

  //   just a range over the number of frets
  $: fretArray = [...Array(frets).keys()]
</script>

<svg width="2000px" height="200px">
  <g transform="translate(80, 50)">
    <!-- the nut -->
    <line
      data-v-6d8a98b6=""
      x1="50"
      y1="0"
      x2="50"
      y2={(tuning.length - 1) * 25}
      stroke="#000"
      stroke-width="5px"
    />

    {#each fretArray as fret, fretIndex}
      {#each tuning as openString, stringIndex}
        <!-- string -->
        <line
          data-v-6d8a98b6=""
          x1={50 * fretIndex + 50}
          y1={stringIndex * 25}
          x2={50 * fretIndex + 100}
          y2={stringIndex * 25}
          stroke="#000"
        />
        <!-- finger -->
        <NoteCircle {stringIndex} {fretIndex} {fretMap} {tuning} {root} />
      {/each}
      <!-- the fret -->
      <line
        data-v-6d8a98b6=""
        x1={50 * fretIndex + 100}
        y1="0"
        x2={50 * fretIndex + 100}
        y2={(tuning.length - 1) * 25}
        stroke="#000"
        stroke-width="2px"
      />
    {/each}
  </g>
</svg>
