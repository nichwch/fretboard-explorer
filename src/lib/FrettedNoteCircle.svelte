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
  export let root: string
  export let tuning: Tuning
  export let color: string

  const stringSpacing: number = getContext('stringSpacing')
  const fretSpacing: number = getContext('fretSpacing')

  let fretMapHoveredNote: Writable<NoteName | null> =
    getContext('fretMapHoveredNote')

  $: currentPitchClass = pcByStringAndFret(tuning, stringIndex, fretIndex)

  $: isRoot = currentPitchClass === root
  // make them all match the accidentals the user has selected
  $: {
    let note = Note.get(currentPitchClass)
    if ($flatOrSharp !== note.acc) {
      currentPitchClass = Note.enharmonic(note.name)
    } else {
      currentPitchClass = note.name
    }
  }
</script>

<!-- hover target -->

<circle
  transition:fly|local={{ y: -20, duration: 300 }}
  cx={fretSpacing * fretIndex - fretSpacing / 2}
  cy={stringIndex * stringSpacing}
  r="10"
  fill={isRoot ? 'black' : color}
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
