import { IfLoggedIn } from './session/ifLoggedIn';
import * as React from 'react';
import { withRouter } from 'react-router';
import { sessionService } from './session/state';
import { Link, Redirect, Route } from 'react-router-dom';

class Nav extends React.Component<any> {
  logout = () => {
    sessionService.logout();
    this.props.history.push('/');
  };

  render() {
    return (
      <div className="padding">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/todos">Todos</Link>
          </li>

          <li>
            <Link to="/users">Users</Link>
          </li>

          <IfLoggedIn>
            <li>
              <Link to="/books">Books</Link>
            </li>
          </IfLoggedIn>

          <IfLoggedIn>
            <li>
              <button onClick={this.logout}>Logout</button>
            </li>
          </IfLoggedIn>

          <IfLoggedIn show={false}>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </IfLoggedIn>

        </ul>

        <hr/>
      </div>
    )
  }
}

export const NavWithRouter = withRouter(Nav);