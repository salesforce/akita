<script>
  import { store, selectCount } from "./count.state";

  function handleClick() {
    store.update(state => ({
      count: state.count + 1
    }));
  }
</script>

<h1>Svelte Akita</h1>
<button on:click={handleClick}>Clicks: {$selectCount} </button>
