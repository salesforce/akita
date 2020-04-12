import React from 'react';
import { pure } from 'recompose';
import { Book as BookModel } from './state';

export const Book = pure(({ title, price }: BookModel) => {
  console.log('Book - rerender');
  return (
    <div>
      <h1>{title}</h1>
      <p>Price: {price}$</p>
    </div>
  );
});

export const Books = pure(({ books }: { books: BookModel[] }) => {
  console.log('Books - rerender');
  return books.map(book => <Book key={book.id} {...book} />);
});
