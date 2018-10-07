import * as React from 'react';
import { Book, booksQuery, booksService } from './state';
import { untilDestroyed } from '../take-until';
import { Books } from './Book';

export default class BooksPageComponent extends React.PureComponent {
  state: { books: Book[]; loading: boolean } = { books: [], loading: true };

  componentDidMount() {
    booksQuery.selectAll()
      .pipe(untilDestroyed(this))
      .subscribe(books => this.setState({ books }));

    booksQuery.selectLoading()
      .pipe(untilDestroyed(this))
      .subscribe(loading => this.setState({ loading }));

    booksService.fetch();
  }

  render() {
    const isLoading = this.state.loading;
    let view;
    if( isLoading ) {
      view = <h1>Loading Books...</h1>
    } else {
      view = <Books books={this.state.books}/>;
    }

    return (
      <React.Fragment>
        {view}
      </React.Fragment>
    );
  }
}
