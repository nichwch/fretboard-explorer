<script type="ts">
  import Router from 'svelte-spa-router'
  import About from './About.svelte'
  import App from './App.svelte'
</script>

<Router
  routes={{
    '/': App,
    '/about': About,
  }}
/>
