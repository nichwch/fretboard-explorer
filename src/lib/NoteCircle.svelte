<script lang="ts">
  import { getContext } from 'svelte'
  import { colors } from '../utils/style-constants'
  import { noteByStringAndFret as pcByStringAndFret } from './guitar'
  import type { FretMap, Tuning } from './types'
  import { Note, type NoteName } from 'tonal'
  import type { Writable } from 'svelte/store'
  import { flatOrSharp } from './flatOrSharpStore'
  import { fade, fly } from 'svelte/transition'

  export let stringIndex: number
  export let fretIndex: number
  export let fretMap: FretMap
  export let tuning: Tuning
  export let root: string
  export let isOverlay: boolean

  const stringSpacing: number = getContext('stringSpacing')
  const fretSpacing: number = getContext('fretSpacing')

  let fretMapHoveredNote: Writable<NoteName | null> =
    getContext('fretMapHoveredNote')
  let currentPitchClass = pcByStringAndFret(tuning, stringIndex, fretIndex)

  $: fretPressedInFretMap = fretMap[stringIndex].includes(fretIndex)
  $: isRoot = pcByStringAndFret(tuning, stringIndex, fretIndex) === root
  // make them all match the accidentals the user has selected
  $: {
    let note = Note.get(pcByStringAndFret(tuning, stringIndex, fretIndex))
    if ($flatOrSharp !== note.acc) {
      currentPitchClass = Note.enharmonic(note.name)
    } else {
      currentPitchClass = note.name
    }
  }

  let mainColor = colors.green[100]

  $: {
    if (isRoot) {
      if (isOverlay) {
        mainColor = colors.red[500]
      } else {
        mainColor = colors.gray[900]
      }
    } else {
      if (isOverlay) {
        mainColor = colors.red[100]
      } else {
        mainColor = colors.green[100]
      }
    }
  }
</script>

<!-- hover target -->

{#if fretPressedInFretMap}
  <circle
    transition:fly|local={{ y: -20, duration: 300 }}
    cx={fretSpacing * fretIndex - fretSpacing / 2}
    cy={stringIndex * stringSpacing}
    r="10"
    fill={mainColor}
    stroke="black"
    stroke-dasharray={$fretMapHoveredNote === currentPitchClass && !isRoot
      ? '4,4'
      : '0'}
  />
  <text
    transition:fly|local={{ y: -20, duration: 300 }}
    data-v-6d8a98b6=""
    font-size="11"
    x={fretSpacing * fretIndex - fretSpacing / 2}
    y={stringIndex * stringSpacing}
    dominant-baseline="central"
    fill={isRoot ? 'white' : 'black'}
    font-weight="normal"
    text-anchor="middle"
  >
    {currentPitchClass}
  </text>
{:else if $fretMapHoveredNote === currentPitchClass}
  <!-- show this only on hover -->
  <circle
    transition:fade|local={{ duration: 200 }}
    cx={fretSpacing * fretIndex - fretSpacing / 2}
    cy={stringIndex * stringSpacing}
    r="10"
    fill="white"
  />
  <text
    transition:fade|local={{ duration: 200 }}
    data-v-6d8a98b6=""
    font-size="11"
    x={fretSpacing * fretIndex - fretSpacing / 2}
    y={stringIndex * stringSpacing}
    dominant-baseline="central"
    fill={isRoot ? 'white' : 'black'}
    font-weight="normal"
    text-anchor="middle"
  >
    {currentPitchClass}
  </text>
{/if}
<circle
  cx={fretSpacing * fretIndex - fretSpacing / 2}
  cy={stringIndex * stringSpacing}
  r="10"
  fill="transparent"
  on:mouseenter={() => {
    fretMapHoveredNote.set(currentPitchClass)
  }}
  on:mouseleave={() => {
    fretMapHoveredNote.set(null)
  }}
/>
