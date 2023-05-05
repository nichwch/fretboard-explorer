<script lang="ts">
  import { afterUpdate } from 'svelte'
  import { borderRadius, colors, spacing } from '../utils/style-constants'
  import metronomeSoundWav from '../assets/metronome.wav'

  let bpm = 100
  let playing = false

  let metronomeInterval = null
  const metronomeSound = new Audio(metronomeSoundWav)

  console.log('hi')
  afterUpdate(() => {
    if (playing) {
      metronomeSound.pause()
      clearInterval(metronomeInterval)
      metronomeInterval = setInterval(() => {
        metronomeSound.load()
        metronomeSound.play()
        console.log('tick')
      }, 60000 / bpm)
    } else {
      metronomeSound.pause()
      clearInterval(metronomeInterval)
    }
  })
</script>

<div
  style:margin-left="auto"
  style:background-color={colors.red[200]}
  style:padding={spacing[1]}
  style:border-radius={borderRadius.md}
>
  <input bind:value={bpm} type="number" />
  <button
    on:click={() => {
      playing = !playing
    }}
    >{#if playing}
      pause
    {:else}
      play
    {/if}
  </button>
</div>
