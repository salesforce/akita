import { Book } from './book.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface BooksState extends EntityState<Book> {}

@StoreConfig({ name: 'books' })
export class BooksStore extends EntityStore<BooksState> {
  constructor() {
    super();
  }
}

export const booksStore = new BooksStore();
