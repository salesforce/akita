import { ID } from '@datorama/akita';

export type Todo = {
  id: ID;
  title: string;
  completed: boolean;
};

/**
 * Factory function that creates todos
 * @param {ID} id
 * @param {string} title
 * @returns {Todo}
 */
export function createTodo({ id, title }: Partial<Todo>) {
  return {
    id,
    title,
    completed: false
  } as Todo;
}
