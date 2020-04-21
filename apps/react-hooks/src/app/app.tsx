import React from 'react';
import './app.css';
import { Link, Route } from 'react-router-dom';
import { Home } from './Home';
import { todosQuery } from './state/todos.query';
todosQuery.selectAll().subscribe(console.log);

export const App = () => {
  return (
    <div className="app">
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Route
        path="/"
        exact
        render={Home}
      />
      <Route
        path="/page-2"
        exact
        render={() => (
          <div>
            <Link to="/">Click here to go back to root page.</Link>
          </div>
        )}
      />
    </div>
  );
};

export default App;
