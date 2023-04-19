<script lang="ts">
  import { STANDARD_TUNING } from '../guitar'
  import ChordDisplay from './ChordDisplay.svelte'
  import type { FretMap, Phrase, Tuning } from './types'

  export let fretMap: FretMap
  export let frets: number = 22
  export let tuning: Tuning = STANDARD_TUNING
</script>

<svg width="175px">
  <g>
    <line
      data-v-6d8a98b6=""
      x1="72.963"
      y1="0"
      x2="72.963"
      y2="125"
      stroke="#000"
    />
    <circle cx="10" cy="10" r="10" fill="black" />
  </g>
</svg>
