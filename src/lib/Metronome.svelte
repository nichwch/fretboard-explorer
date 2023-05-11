<script lang="ts">
  import { afterUpdate } from 'svelte'
  import { borderRadius, colors, spacing } from '../utils/style-constants'
  import metronomeSoundWav from '../assets/metronome.wav'
  import { onMount } from 'svelte'

  let bpm = 100
  let playing = false

  let metronomeInterval = null
  const metronomeSound = new Audio(metronomeSoundWav)

  console.log('hi')
  afterUpdate(() => {
    if (!playing) {
      metronomeSound.pause()
    }
  })

  let ac = new AudioContext()

  let lastTime = ac?.currentTime

  const playSoundFunction = () => {
    console.log('PLAYING', playing, bpm, 60000 / bpm)
    if (!playing) {
      return
    }
    metronomeSound.load()
    metronomeSound.play()
    console.log('tick')

    const diff = (ac.currentTime - lastTime) * 1000
    lastTime = ac.currentTime
    const intervalTime = 60000 / bpm
    let nextIntervalTime = intervalTime - (diff - intervalTime)

    console.log('DIFF', diff, nextIntervalTime)
    setTimeout(playSoundFunction, nextIntervalTime)
  }

  // setTimeout(playSoundFunction, 60000 / bpm)
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
      ac.resume()
      if (!playing) {
        metronomeSound.load()
        metronomeSound.play()
        lastTime = ac?.currentTime
        setTimeout(playSoundFunction, 60000 / bpm)
      }
      playing = !playing
    }}
    >{#if playing}
      pause
    {:else}
      play
    {/if}
  </button>
</div>
