<script lang="ts">
  import { getContext } from 'svelte'
  import NoteCircle from './NoteCircle.svelte'
  import {
    FRET_INLAYS,
    GUITAR_STANDARD_FRETS,
    GUITAR_STANDARD_TUNING,
  } from './constants'
  import type { FretMap, Phrase, Tuning } from './types'
  import { colors, spacing } from '../utils/style-constants'
  import FrettedNoteCircle from './FrettedNoteCircle.svelte'

  export let fretMap: FretMap
  export let overlayFretMap: FretMap | null
  export let overlayRoot: string | null
  export let frets: number = GUITAR_STANDARD_FRETS
  export let tuning: Tuning = GUITAR_STANDARD_TUNING
  export let root: string
  let fretArray = [...Array(frets + 1).keys()]

  let fretInlaysThatFit = FRET_INLAYS.filter((fret) => fret < frets)
  const INLAY_OFFSET_FROM_FRET = 8
  const stringSpacing: number = getContext('stringSpacing')
  const fretSpacing: number = getContext('fretSpacing')
</script>

<svg width="800px" height="200px" style:padding-left={spacing[5]}>
  <g transform="translate(50, 25)">
    <!-- fretboard inlays -->
    {#each fretInlaysThatFit as fretInlayLocation, index (index)}
      {#if fretInlayLocation === 11}
        <!-- twelfth fret inlay -->
        <polygon
          points={`${
            fretInlayLocation * fretSpacing + INLAY_OFFSET_FROM_FRET
          },${stringSpacing / 2} 
      ${fretInlayLocation * fretSpacing + INLAY_OFFSET_FROM_FRET}, ${
            (tuning.length - 1.5) * stringSpacing
          } 
      ${
        fretInlayLocation * fretSpacing + fretSpacing - INLAY_OFFSET_FROM_FRET
      }, ${(tuning.length - 1.5) * stringSpacing} 
      ${
        fretInlayLocation * fretSpacing + fretSpacing - INLAY_OFFSET_FROM_FRET
      },${stringSpacing / 2} 
  `}
          fill={colors.gray[100]}
          stroke={colors.gray[200]}
        />
      {:else}
        <polygon
          points={`${fretInlayLocation * fretSpacing + fretSpacing / 2},${
            stringSpacing / 2
          } 
           ${fretInlayLocation * fretSpacing + INLAY_OFFSET_FROM_FRET},${
            ((tuning.length - 1) / 2.0) * stringSpacing
          } 
          ${fretInlayLocation * fretSpacing + fretSpacing / 2}, ${
            (tuning.length - 1.5) * stringSpacing
          } 
          ${
            fretInlayLocation * fretSpacing +
            fretSpacing -
            INLAY_OFFSET_FROM_FRET
          },${((tuning.length - 1) / 2.0) * stringSpacing} 
          `}
          fill={colors.gray[100]}
          stroke={colors.gray[200]}
        />
      {/if}
    {/each}
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

    {#each fretArray as fretIndex}
      {#each tuning as openString, stringIndex}
        {#if fretIndex > 0}
          <!-- string -->
          <line
            data-v-6d8a98b6=""
            x1={fretSpacing * (fretIndex - 1)}
            y1={stringIndex * stringSpacing}
            x2={fretSpacing * fretIndex}
            y2={stringIndex * stringSpacing}
            stroke="#000"
          />
        {/if}
      {/each}
      <!-- the fret -->
      <line
        data-v-6d8a98b6=""
        x1={fretSpacing * fretIndex}
        y1="0"
        x2={fretSpacing * fretIndex}
        y2={(tuning.length - 1) * stringSpacing}
        stroke="#000"
        stroke-width="2px"
      />
    {/each}
    {#each tuning as openString, stringIndex}
      {#each fretMap[stringIndex] as fretIndex}
        <FrettedNoteCircle
          {stringIndex}
          {fretIndex}
          {root}
          {tuning}
          color={colors.green[100]}
        />
      {/each}
    {/each}
  </g>
</svg>
