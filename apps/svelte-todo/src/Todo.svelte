<svelte:options immutable />

<script>
  export let todo;
</script>

<style>
  li {
    display: flex;
    justify-content: space-between;
  }
</style>

<li class="list-group-item">
  <div>
    <input type="checkbox" checked={todo.completed} on:change />
     {todo.title}
  </div>

  <button type="button" class="btn btn-sm btn-danger" on:click>X</button>
</li>
