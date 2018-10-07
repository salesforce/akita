import { BooksStore, BooksState, booksStore } from './books.store';
import { Book } from './book.model';
import { QueryEntity } from '../../../../akita/src';

export class BooksQuery extends QueryEntity<BooksState, Book> {

  constructor(protected store: BooksStore) {
    super(store);
  }

}

export const booksQuery = new BooksQuery(booksStore);
