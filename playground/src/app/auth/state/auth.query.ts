import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { User } from './auth.model';
import { Query } from '@datorama/akita';
import * as localForage from 'localforage';
import { from, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthQuery extends Query<User> {
  isLoggedIn$ = combineLatest(this.select(user => !!user.token), inStorageAsync()).pipe(
    map(([hasToken, inStorage]) => {
      return hasToken || inStorage;
    })
  );

  constructor(protected store: AuthStore) {
    super(store);
  }
}

export function inStorageAsync() {
  return from(localForage.getItem('AkitaStores'))
    .pipe(map((v: string) => v && JSON.parse(v)))
    .pipe(map(v => v && !!v.auth));
}

export function inStorage() {
  const storage = JSON.parse(localStorage.getItem('AkitaStores'));
  return storage && storage.auth;
}
