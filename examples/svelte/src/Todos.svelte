<svelte:options immutable />

<script>
  import {
    visibleTodos,
    addTodo,
    readTodos,
    removeTodo,
    selectFilter,
    updateFilter,
    toggleCompleted
  } from "./state";

import Todo from './Todo.svelte';
import AddTodo from './AddTodo.svelte';
import Filters from './Filters.svelte';

  let todo = "";
  readTodos();
</script>

<style>
  input {
    margin-right: 10px;
  }

  section {margin-top: 20px}
</style>

<section>
  <h1>Todos</h1>

  <Filters currentFilter={selectFilter}
    on:click={event => updateFilter(event.target.dataset.filterId)}/>

  <AddTodo on:todo={ e => addTodo(e.detail) }/>

  <ul class="list-group">
    {#each $visibleTodos as todo, i (todo.id)}
      <Todo {todo}
        on:click={() => removeTodo(todo.id)}
        on:change={e => toggleCompleted(todo.id, e.target.checked)} />
    {/each}
  </ul>
  {$visibleTodos.length}
</section>
