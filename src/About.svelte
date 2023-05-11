<script type="ts">
  import { fade } from 'svelte/transition'
  import { db } from './lib/db'
  import {
    AUTUMN_LEAVES,
    BASIC_SCALE_PRACTICE,
    COMPARING_SCALES,
  } from './lib/sample_practice_sheets'
  import { colors, sizes, spacing } from './utils/style-constants'
</script>

<main style:height="100%" transition:fade={{ duration: 200 }}>
  <div id="main">
    <div
      id="topNav"
      style:padding={spacing[3]}
      style:background-color={colors.green[300]}
      style:border-bottom={`1px solid black`}
      style:display="flex"
      style:align-items="center"
    >
      <span style:font-weight="bold">fretboard explorer</span>
      <span style:margin-left={spacing[3]}><a href="/">back</a></span>
    </div>
    <div id="beneathNav">
      <div
        style:padding={spacing[3]}
        style:margin-left="auto"
        style:margin-right="auto"
        style:max-width={sizes.xl}
      >
        <h1>About this app</h1>
        <h2>About me</h2>
        <p>
          I play the guitar (sometimes the bass) and wanted to make a tool to
          help me practice scales/arpeggios.
        </p>
        <p>
          You can find my personal website <a href="https://nicholaschen.io/"
            >here</a
          > - it contains other side projects I've worked on.
        </p>
        <h2>
          I screwed up and deleted the sample practice sheets! How can I get
          them back?
        </h2>
        <p>
          Go ahead and press this button: <button
            on:click={() => {
              //@ts-ignore
              db.practice_sheets.add({
                ...COMPARING_SCALES,
                creation_date: new Date(),
              })
              //@ts-ignore
              db.practice_sheets.add({
                ...AUTUMN_LEAVES,
                creation_date: new Date(),
              })
              //@ts-ignore
              db.practice_sheets.add({
                ...BASIC_SCALE_PRACTICE,
                creation_date: new Date(),
              })
            }}>Restore sample practice sheets</button
          >
        </p>

        <h2>Is this open source?</h2>
        <p>
          Yes! The repo is <a
            href="https://github.com/nichwch/guitar-practice-tools">here</a
          >, go ahead and fork it.
        </p>
        <h2>This is cool, can I give you money?</h2>
        <p>
          <a
            href="https://www.paypal.com/donate/?business=JKTGVXAQNYVWU&no_recurring=0&item_name=Buy+me+a+coffee+&currency_code=USD"
            >Of course.</a
          >
        </p>
        <h2>Where is my data stored?</h2>
        <p>
          It's stored right here in your browser, in IndexedDB. No data is sent
          to any third party server.
        </p>
        <h2>What was this app made with?</h2>
        <p>
          It was made with <a href="https://svelte.dev">Svelte.js</a>,
          <a href="https://github.com/tonaljs/tonal">Tonal</a>, and
          <a href="https://dexie.org/">Dexie.js.</a>
        </p>
        <p>
          Very heavy inspiration was taken from <a href="https://fretty.app/"
            >fretty.app</a
          >, which is also
          <a href="https://github.com/tfeldmann/fretty.app">open source.</a>
        </p>
        <h2>Will you support other instruments/tunings?</h2>
        <p>I'll get to it.</p>
      </div>
    </div>
  </div>
</main>

<style>
  #main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  #topNav {
    display: flex;
  }

  #beneathNav {
    display: flex;
    flex-grow: 1;
    /* stupidest css hack ever but neccessary for scrolling to work here */
    height: 1px;
  }
</style>
