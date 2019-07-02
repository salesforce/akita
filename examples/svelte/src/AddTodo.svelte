<svelte:options immutable />

<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let todo = "";
</script>

<div class="form-group">
  <input
    class="form-control"
    placeholder="Add todo.."
    on:keydown={event => {
      if (event.key === 'Enter') {
        dispatch('todo', todo);
        todo = '';
      }
    }}
    bind:value={todo} />
</div>
