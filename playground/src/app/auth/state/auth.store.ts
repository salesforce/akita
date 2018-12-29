import { Injectable } from '@angular/core';
import { createEmptyUser, User } from './auth.model';
import { StoreConfig, Store, StoreOnInit } from '@datorama/akita';
export const initialState: User = createEmptyUser();

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'auth'
})
export class AuthStore extends Store<User> implements StoreOnInit {
  constructor() {
    super(initialState);
  }

  storeOnInit() {
    console.log('Hello from on init life cycle hook!');
  }

  storeOnUpdate(prevState: User, newState: User) {
    console.log('previous state: ', prevState);
    console.log('new state: ', newState);
  }
}
