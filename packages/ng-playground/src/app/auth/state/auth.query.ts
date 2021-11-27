import { Injectable } from '@angular/core';
import { AuthState, AuthStore } from './auth.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  isLoggedIn$ = this.select(user => !!user.token);

  constructor(protected store: AuthStore) {
    super(store);
  }
}
