<script lang="ts">
  import { fade } from 'svelte/transition'
  import { spacing } from '../utils/style-constants'
</script>

<div transition:fade={{ duration: 200 }} style:padding={spacing[10]}>
  <h1>Welcome to guitar tools!</h1>
  <p>
    Please select a practice sheet (or create a new one) from the sidebar to
    continue.
  </p>
</div>
