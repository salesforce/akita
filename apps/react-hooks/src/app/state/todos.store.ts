import { createEntityStore, EntityState } from '@datorama/akita';

export type Todo = {
  id: number;
  title: string;
};

export interface TodosState extends EntityState<Todo, number> {}

export const todosStore = createEntityStore<TodosState>({}, { name: 'todos' });
