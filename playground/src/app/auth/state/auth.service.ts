import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { mapTo, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

export type Creds = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authStore: AuthStore) {}

  login(creds: Creds) {
    return simulateRequest(creds).pipe(tap(user => this.authStore.update(user)));
  }

  logout() {
    this.authStore.reset();
  }
}

export function simulateRequest(creds: Creds) {
  return timer(400).pipe(
    mapTo({
      id: 1,
      firstName: 'Netanel',
      lastName: 'Basal',
      token: 'token'
    })
  );
}
