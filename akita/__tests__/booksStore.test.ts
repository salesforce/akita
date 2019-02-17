import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';

export type TestBook = {
  id: ID;
  title: string;
  price: number;
};

export interface TestBooksState extends EntityState<TestBook> {
  filter: string;
}

@StoreConfig({ name: 'books' })
export class BooksStore extends EntityStore<TestBooksState, TestBook> {
  constructor() {
    super({ filter: 'ALL' });
  }
}
