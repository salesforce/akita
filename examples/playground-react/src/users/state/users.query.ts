import { UsersStore, UsersState, usersStore } from './users.store';
import { User } from './user.model';
import { QueryEntity } from '../../../../akita/src';

export class UsersQuery extends QueryEntity<UsersState, User> {
  constructor(protected store: UsersStore) {
    super(store);
  }
}

export const usersQuery = new UsersQuery(usersStore);
