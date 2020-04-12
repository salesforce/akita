import { BooksStore, BooksState, booksStore } from './books.store';
import { QueryEntity } from '@datorama/akita';

export class BooksQuery extends QueryEntity<BooksState> {
  constructor(protected store: BooksStore) {
    super(store);
  }
}

export const booksQuery = new BooksQuery(booksStore);
