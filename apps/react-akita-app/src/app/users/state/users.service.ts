import { UsersStore, usersStore } from './users.store';
import { of } from 'rxjs';
import data from '../users.data';
import { User } from './user.model';
import { ID } from '@datorama/akita';

export class UsersService {
  constructor(private usersStore: UsersStore) {}

  get() {
    of(data).subscribe(entities => {
      this.usersStore.set(entities);
    });
  }

  setActive(id: ID) {
    this.usersStore.setActive(id);
  }

  updateActive(user: User) {
    this.usersStore.updateActive(user);
  }
}

export const usersService = new UsersService(usersStore);
