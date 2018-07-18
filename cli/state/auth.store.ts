import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export type AuthState = {};

export function createInitialAuthState(): AuthState {
  return {};
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(createInitialAuthState());
  }
}
