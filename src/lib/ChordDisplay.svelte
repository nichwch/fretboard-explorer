<script lang="ts">
  import type { Chord } from './types'
  export let chord: Chord
  chord.reverse()
</script>

<div id="parent">
  <div>
    {#each chord as note}
      <div class="note" class:is_zero={note === 0}>{note}</div>
    {/each}
  </div>
</div>

<style>
  #parent {
    height: 120px;
    display: inline-flex;
  }
  .note {
    display: block;
    height: 16.66%;
  }

  .is_zero {
    opacity: 0.5;
  }

  .note {
    font-weight: bold;
  }
</style>
