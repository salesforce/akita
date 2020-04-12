import React from 'react';
import { sessionService } from './state';

export class LoginPageComponent extends React.PureComponent<any> {
  login = () => {
    sessionService.login();
    this.props.history.push('/books');
  };

  render() {
    return (
      <section>
        <button onClick={this.login}>Click here to Login</button>
      </section>
    );
  }
}
