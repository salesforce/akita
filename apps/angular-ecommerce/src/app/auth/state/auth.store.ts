import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface AuthState {
  token: string;
  name: string;
}

export function createInitialState(): AuthState {
  return {
    name: null,
    token: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(createInitialState());
  }
}
