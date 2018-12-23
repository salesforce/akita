import { Injectable } from '@angular/core';
import { createEmptyUser, User } from './auth.model';
import { StoreConfig, Store } from '@datorama/akita';
export const initialState: User = createEmptyUser();

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'auth'
})
export class AuthStore extends Store<User> {
  constructor() {
    super(initialState);
  }
}
