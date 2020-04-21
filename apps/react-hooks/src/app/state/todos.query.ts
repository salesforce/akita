import { createEntityQuery } from '@datorama/akita';
import { TodosState, todosStore } from './todos.store';

export const todosQuery = createEntityQuery<TodosState>(todosStore);
