import { Injectable } from '@angular/core';
import { AuthState, AuthStore } from './auth.store';
import { Query } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class AuthQuery extends Query<AuthState> {
  isLoggedIn$ = combineLatest(this.select(user => !!user.token), of(inStorage())).pipe(map(([hasToken, inStorage]) => hasToken || inStorage));

  constructor(protected store: AuthStore) {
    super(store);
  }
}

export function inStorage() {
  const storage = JSON.parse(localStorage.getItem('AkitaStores'));
  return storage && storage.auth;
}
