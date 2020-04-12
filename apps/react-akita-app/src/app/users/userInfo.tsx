import * as React from 'react';
import { User } from './state/user.model';
import { ChangeEvent, FormEvent } from 'react';

interface Props {
  active: User | null;
  submit: Function;
}

interface State {
  active: User | null;
}

/**
 * In real-life you'll use form library
 */
export class UserInfo extends React.PureComponent<Props, State> {
  state: { active: User | null } = { active: this.props.active };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.updateEmail(event.target.value);
  };

  componentWillReceiveProps({ active }: Props) {
    if (active) {
      this.updateEmail(active.email);
    }
  }

  updateEmail(email: string) {
    this.setState({
      active: {
        email
      }
    } as State);
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.submit({ email: this.state.active!.email });
  };

  render() {
    let view = null;

    if (this.state.active) {
      const { email } = this.state.active;

      view = (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input type="email" onChange={this.handleChange} value={email} />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }

    return view;
  }
}
