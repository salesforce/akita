import React from 'react';
import { Users } from './usersList';
import { UserInfo } from './userInfo';
import { User } from './state/user.model';
import { usersService } from './state/users.service';
import { usersQuery } from './state/users.query';
import { ID } from '@datorama/akita';

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
    // @ts-ignore: TS thinks it's calling Observable<T>.subscribe(next: null, error: null, complete: () => void)
    usersQuery.selectActive().subscribe(active => this.setState({ active })); // TODO fix type error
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
