<script lang="ts">
  import NoteCircle from './NoteCircle.svelte'
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './tunings'
  import type { FretMap, Phrase, Tuning } from './types'

  export let fretMap: FretMap
  export let frets: number = GUITAR_STANDARD_FRETS
  export let tuning: Tuning = GUITAR_STANDARD_TUNING
  export let root: string
  let fretArray = [...Array(frets).keys()]
  console.log('fretmap render', root)
  //   just a range over the number of frets
  $: {
    fretMap
    fretArray = [...Array(frets).keys()]
  }
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
