import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { akitaDevtools, persistState } from '@datorama/akita';
import Loadable from 'react-loadable';

import './app.css';
import { LoginPageComponent } from './session/LoginPage';
import { ProtectedRoute } from './protected-route';
import { NavWithRouter } from './nav';
import { TodosPageComponent } from './todos/TodosPage';

akitaDevtools();

persistState({
  include: ['session.token']
});

const Loading = () => <div>Loading...</div>;

const Home = Loadable({
  loader: () => import('./home-page'),
  loading: Loading
});

const Books = Loadable({
  loader: () => import('./books/BooksPage'),
  loading: Loading
});

const Users = Loadable({
  loader: () => import('./users/usersPage'),
  loading: Loading
});

Books.preload();
Users.preload();

export class App extends React.PureComponent<any> {
  render() {
    return (
      <Router>
        <React.Fragment>
          <NavWithRouter />
          <Route exact={true} path="/" component={Home} />
          <Route path="/login" component={LoginPageComponent} />
          <Route path="/todos" component={TodosPageComponent} />
          <Route path="/users" component={Users} />
          <ProtectedRoute path="/books" component={Books} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
