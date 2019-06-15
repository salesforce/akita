import { guid, ID } from '@datorama/akita';

export type Todo = {
  id: ID;
  title: string;
  completed: boolean;
};

export function createTodo(title: Todo['title']) {
  return {
    id: guid(),
    title,
    completed: false
  } as Todo;
}
