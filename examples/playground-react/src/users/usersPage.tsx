import * as React from 'react';
import { Users } from './usersList';
import { UserInfo } from './userInfo';
import { User } from './state/user.model';
import { usersService } from './state/users.service';
import { usersQuery } from './state/users.query';
import { ID } from '../../../akita/src';

interface Props {}

interface State {
  users: User[];
  active: User | null;
}

export default class UsersPage extends React.PureComponent<Props, State> {
  state = { users: [], active: null };

  setActive = (id: ID) => usersService.setActive(id);
  update = (newUser: User) => usersService.updateActive(newUser);

  componentDidMount() {
    usersQuery.selectAll().subscribe(users => this.setState({ users }));
    usersQuery.selectActive().subscribe(active => this.setState({ active }));
    usersService.get();
  }

  render() {
    return (
      <section className="users-container">
        <Users users={this.state.users} setActive={this.setActive} />
        <UserInfo active={this.state.active} submit={this.update} />
      </section>
    );
  }
}
