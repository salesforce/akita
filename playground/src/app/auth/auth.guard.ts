import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { inStorage } from './state/auth.query';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (inStorage()) {
      return true;
    }

    this.router.navigateByUrl('login');
    return false;
  }
}
