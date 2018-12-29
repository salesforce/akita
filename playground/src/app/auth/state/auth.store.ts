import { Injectable } from '@angular/core';
import { createEmptyUser, User } from './auth.model';
import { StoreConfig, Store } from '@datorama/akita';
import { AkitaOnInit } from '../../../../../akita/index';
export const initialState: User = createEmptyUser();

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'auth'
})
export class AuthStore extends Store<User> implements AkitaOnInit {
  constructor() {
    super(initialState);
  }

  akitaOnInit() {
    console.log('Hello from on init life cycle hook!');
  }
}
