import { Injectable } from '@angular/core';
import { AuthStore, clearStorage, saveInStorage } from './auth.store';
import { AuthDataService } from './auth-data.service';
import { createEmptyUser, Creds } from './auth.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authStore: AuthStore, private authDataService: AuthDataService) {}

  /**
   *
   * @param {Creds} creds
   * @returns {Observable<any>}
   */
  login(creds: Creds) {
    return this.authDataService.login(creds).pipe(
      tap(user => {
        saveInStorage(user.token);
        this.authStore.update(user);
      })
    );
  }

  /**
   * Reset the store
   */
  logout() {
    clearStorage();
    this.authStore.update(createEmptyUser());
  }
}
