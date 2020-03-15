import { guid, ID } from '@datorama/akita';

export interface Book {
  id: ID;
  title: string;
  price: number;
}

export function createBook(params: Partial<Book>) {
  return {
    id: guid(),
    ...params
  } as Book;
}
