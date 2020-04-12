import { User } from './user.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface UsersState extends EntityState<User> {}

@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersState, User> {
  constructor() {
    super();
  }
}

export const usersStore = new UsersStore();
