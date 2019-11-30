import {
  todosStore
} from './todos.store';
import {
  guid
} from '@datorama/akita';

export async function readTodos() {
  const todos = await Promise.resolve([{id:1, completed: true, title: 'create sample Svelte+Akita todo app'}]);
  todosStore.set(todos);
}

export async function addTodo(title) {
  const todo = {
    title,
    completed: false,
  };
  const idFromServer = await Promise.resolve(guid());
  todosStore.add({
    id: idFromServer,
    ...todo
  });
}

export async function toggleCompleted(id, completed) {
  await Promise.resolve();
  todosStore.update(id, {
    completed
  });
}

export async function removeTodo(id) {
  await Promise.resolve();
  todosStore.remove(id);
}

export function updateFilter(filter) {
  todosStore.update({
    filter
  });
}
