import { guid, ID } from '../../../../akita/src';

export type Todo = {
  id: ID;
  text: string;
  completed: boolean;
};

export function createTodo(text: string) {
  return {
    id: guid(),
    text,
    completed: false
  } as Todo;
}

export enum VISIBILITY_FILTER {
  SHOW_COMPLETED = "SHOW_COMPLETED",
  SHOW_ACTIVE = "SHOW_ACTIVE",
  SHOW_ALL = "SHOW_ALL"
}
