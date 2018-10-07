import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LoginPageComponent } from './session/LoginPage';
import { ProtectedRoute } from './protected-route';
import { NavWithRouter } from './Nav';
import Loadable from 'react-loadable';
import { akitaDevtools } from '../../akita/src/enhancers/devtools';
import { persistState } from '../../akita/src';

akitaDevtools();

persistState({
  include: ['session.token']
});

const Loading = () => <div>Loading...</div>;

const Home = Loadable({
  loader: () => import('./HomePage'),
  loading: Loading,
});

const Books = Loadable({
  loader: () => import('./books/BooksPage'),
  loading: Loading,
});

Books.preload();

export class AppComponent extends React.PureComponent<any> {
  render() {
    return (
      <Router>
        <React.Fragment>
          <NavWithRouter/>
          <Route exact={true} path="/" component={Home}/>
          <Route path="/login" component={LoginPageComponent}/>
          <ProtectedRoute path='/books' component={Books}/>
        </React.Fragment>
      </Router>
    )
  }
}

render(<AppComponent/>, document.getElementById('root'));
