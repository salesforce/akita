import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthState, AuthStore } from './auth.store';
import { tap } from 'rxjs/operators';
import { API } from '../../api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private authStore: AuthStore, private http: HttpClient) {}

  login(cred: { email: string; password: string }) {
    return this.http.post<AuthState>(`${API}/login`, cred).pipe(tap(({ token, name }) => this.authStore.update({ token, name })));
  }

  logout() {
    this.authStore.reset();
    localStorage.removeItem('AkitaProducts');
  }
}
