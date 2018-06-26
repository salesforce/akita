import { Injectable } from '@angular/core';
import { createEmptyUser, User } from './auth.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '../../../../../akita/src/api/store-config';
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

export function saveInStorage(token: string) {
  localStorage.setItem('token', token);
}

export function clearStorage() {
  localStorage.removeItem('token');
}
