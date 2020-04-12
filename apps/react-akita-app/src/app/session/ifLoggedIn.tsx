import React from 'react';
import { sessionQuery } from './state';
import { untilDestroyed } from '../take-until';

export class IfLoggedIn extends React.PureComponent<any> {
  state = { isLoggedIn: false };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    sessionQuery.selectIsLoggedIn$.pipe(untilDestroyed(this)).subscribe(isLoggedIn => this.setState({ isLoggedIn }));
  }

  render() {
    let view = null;

    if (this.props.show !== false && this.state.isLoggedIn === true) {
      view = this.props.children;
    }

    if (this.props.show === false && this.state.isLoggedIn === false) {
      view = this.props.children;
    }

    return <React.Fragment>{view}</React.Fragment>;
  }
}
