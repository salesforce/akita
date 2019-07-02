<svelte:options immutable />

<script>
 export let currentFilter;

 const filters = [{
   id: 'SHOW_ALL',
   label: 'All'
 },{
   id: 'SHOW_ACTIVE',
   label: 'Active'
 },{
   id: 'SHOW_COMPLETED',
   label: 'Completed'
 }]
</script>

<div class="btn-group">
  {#each filters as filter}
   <button type="button" class="btn btn-outline-dark"
          class:active={filter.id === $currentFilter ? 'active' : ''}
          data-filter-id="{filter.id}" on:click>{filter.label}</button>
  {/each}
</div>