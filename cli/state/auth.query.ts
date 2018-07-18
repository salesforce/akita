import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthStore, AuthState } from './auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthQuery extends Query<AuthState> {
  constructor(protected store: AuthStore) {
    super(store);
  }

  get state(): AuthState {
    return this.getSnapshot();
  }
}
