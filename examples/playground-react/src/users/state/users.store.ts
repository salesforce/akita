import { User } from './user.model';
import { EntityState, EntityStore, StoreConfig } from '../../../../akita/src';

export interface UsersState extends EntityState<User> {}

@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersState, User> {
  constructor() {
    super();
  }
}

export const usersStore = new UsersStore();
