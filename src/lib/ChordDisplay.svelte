<script lang="ts">
  import type { Chord } from './types'
  export let chord: Chord
  chord.reverse()
</script>

<div id="parent">
  <div class="column">
    <div class="line" />
    <div class="line" />
    <div class="line" />
    <div class="line" />
    <div class="line" />
    <div class="line" />
  </div>
  <div class="note-column">
    {#each chord as note}
      <div class="note" class:is_zero={note === 0}>{note}</div>
    {/each}
  </div>
  <div class="column">
    <div class="line" />
    <div class="line" />
    <div class="line" />
    <div class="line" />
    <div class="line" />
    <div class="line" />
  </div>
</div>

<style>
  #parent {
    height: 100px;
    display: inline-flex;
  }
  .line {
    display: block;
    width: 15px;
    height: 16.66%;
    border-bottom: 1px solid black;
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

  .note-column {
    margin-top: 10%;
  }
</style>
