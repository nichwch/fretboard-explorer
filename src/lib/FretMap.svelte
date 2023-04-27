<script lang="ts">
  import { getContext } from 'svelte'
  import NoteCircle from './NoteCircle.svelte'
  import { GUITAR_STANDARD_FRETS, GUITAR_STANDARD_TUNING } from './tunings'
  import type { FretMap, Phrase, Tuning } from './types'

  export let fretMap: FretMap
  export let frets: number = GUITAR_STANDARD_FRETS
  export let tuning: Tuning = GUITAR_STANDARD_TUNING
  export let root: string
  let fretArray = [...Array(frets).keys()]
  $: {
    console.log('fretmap render', root, fretMap)
  }

  //   just a range over the number of frets
  $: {
    fretMap
    fretArray = [...Array(frets).keys()]
  }

  const fretInlays = [3, 5, 7, 9, 12, 15, 17, 19, 21]

  const stringSpacing: number = getContext('stringSpacing')
  const fretSpacing: number = getContext('fretSpacing')
</script>

<svg width="1000px" height="200px">
  <g transform="translate(0, 50)">
    <!-- the nut -->
    <line
      data-v-6d8a98b6=""
      x1="0"
      y1="0"
      x2="0"
      y2={(tuning.length - 1) * stringSpacing}
      stroke="#000"
      stroke-width="5px"
    />

    {#each fretArray as fret, fretIndex}
      {#each tuning as openString, stringIndex}
        <!-- string -->
        <line
          data-v-6d8a98b6=""
          x1={fretSpacing * fretIndex}
          y1={stringIndex * stringSpacing}
          x2={fretSpacing * (fretIndex + 1)}
          y2={stringIndex * stringSpacing}
          stroke="#000"
        />
        <!-- finger -->
        <NoteCircle {stringIndex} {fretIndex} {fretMap} {tuning} {root} />
      {/each}
      <!-- the fret -->
      <line
        data-v-6d8a98b6=""
        x1={fretSpacing * (fretIndex + 1)}
        y1="0"
        x2={fretSpacing * (fretIndex + 1)}
        y2={(tuning.length - 1) * stringSpacing}
        stroke="#000"
        stroke-width="2px"
      />
    {/each}
    <!-- fretboard inlays -->
    {#each fretInlays as fretInlayLocation}
      <!-- <polygon points={`${}`}/> -->
    {/each}
  </g>
</svg>
