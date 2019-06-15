import { BooksStore, booksStore } from './books.store';
import { timer } from 'rxjs';
import { createBook } from './book.model';

export class BooksService {

  constructor(private booksStore: BooksStore) {
  }

  fetch() {
    // simulate http request
    timer(1000).subscribe(() => {
      this.booksStore.set([createBook({ title: 'Book', price: 10})])
    });
  }
}

export const booksService = new BooksService(booksStore);