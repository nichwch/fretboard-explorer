<script lang="ts">
  import type { Chord } from './types'
  export let chord: Chord
</script>

<div id="parent">
  <div class="line" />
  <div class="line" />
  <div class="line" />
  <div class="line" />
  <div class="line" />
  <div class="line" />
  {#each chord as note}
    <div>{note}</div>
  {/each}
</div>

<style>
  #parent {
    height: 100px;
    display: inline-block;
  }
  .line {
    display: block;
    width: 15px;
    height: 16.66%;
    border-bottom: 1px solid black;
  }
</style>
