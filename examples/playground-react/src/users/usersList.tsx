import * as React from 'react';
import { User as UserModel } from './state/user.model';

interface Props {
  user: UserModel;
  setActive: Function;
}

export class User extends React.PureComponent<Props> {
  render() {
    console.log(`User ${this.props.user.username} - render()`);
    const { avatar, username, email, id } = this.props.user;

    return (
      <li className="collection-item avatar">
        <img src={avatar} className="circle" />
        <span className="title">{username}</span>
        <p>{email}</p>
        <span className="secondary-content">
          <i
            className="material-icons"
            onClick={this.props.setActive.bind(null, id)}
          >
            edit
          </i>
        </span>
      </li>
    );
  }
}

interface UsersProps {
  users: User[];
  setActive: Function;
}

export class Users extends React.PureComponent<UsersProps> {
  render() {
    console.log('Users - render()');
    const users = this.props.users.map((user: any) => {
      return (
        <User key={user.id} user={user} setActive={this.props.setActive} />
      );
    });

    return <ul className="collection">{users}</ul>;
  }
}
