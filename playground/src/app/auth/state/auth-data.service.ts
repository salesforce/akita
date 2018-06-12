import { Injectable } from '@angular/core';
import { Creds, User } from './auth.model';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

const user: User = {
  id: 1,
  firstName: 'Netanel',
  lastName: 'Basal',
  token: 'token'
};

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns {Observable<{}>}
   */
  login(creds: Creds) {
    return timer(400).pipe(mapTo(user));
  }
}
