<script lang="ts">
  import { colors } from '../utils/style-constants'
  import { noteByStringAndFret as pcByStringAndFret } from './guitar'
  import { hoveredNote as hoveredPC } from './hoveredNoteStore'
  import type { FretMap, Tuning } from './types'

  export let stringIndex: number
  export let fretIndex: number
  export let fretMap: FretMap
  export let tuning: Tuning
  export let root: string
  $: {
    console.log('note render', root, fretMap)
  }

  $: fretPressedInFretMap = fretMap[stringIndex].includes(fretIndex + 1)
  $: isRoot = pcByStringAndFret(tuning, stringIndex, fretIndex + 1) === root
  $: currentPitchClass = pcByStringAndFret(tuning, stringIndex, fretIndex + 1)
</script>

<!-- hover target -->

{#if fretPressedInFretMap}
  <circle
    cx={50 * fretIndex + 75}
    cy={stringIndex * 25}
    r="10"
    fill={isRoot ? 'black' : colors.green[200]}
    stroke="black"
    stroke-dasharray={$hoveredPC === currentPitchClass && !isRoot ? '4,4' : '0'}
  />
  <text
    data-v-6d8a98b6=""
    font-size="11"
    x={50 * fretIndex + 75}
    y={stringIndex * 25}
    dominant-baseline="central"
    fill={isRoot ? colors.green[100] : 'black'}
    font-weight="normal"
    text-anchor="middle"
  >
    {currentPitchClass}
  </text>
{:else if $hoveredPC === currentPitchClass}
  <!-- show this only on hover -->
  <circle
    cx={50 * fretIndex + 75}
    cy={stringIndex * 25}
    r="10"
    fill={colors.green[100]}
  />
  <text
    data-v-6d8a98b6=""
    font-size="11"
    x={50 * fretIndex + 75}
    y={stringIndex * 25}
    dominant-baseline="central"
    fill={isRoot ? 'white' : 'black'}
    font-weight="normal"
    text-anchor="middle"
  >
    {currentPitchClass}
  </text>
{/if}
<circle
  cx={50 * fretIndex + 75}
  cy={stringIndex * 25}
  r="10"
  fill="transparent"
  on:mouseenter={() => {
    hoveredPC.set(currentPitchClass)
  }}
  on:mouseleave={() => {
    hoveredPC.set(null)
  }}
/>
