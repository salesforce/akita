<script>
  import { store, query } from "./count.state";

  let count = query.select("count");

  function handleClick() {
    store.update(state => ({
      count: state.count + 1
    }));
  }
</script>

<h1>Svelte Akita</h1>
<button on:click={handleClick}>Clicks: {$count} </button>
