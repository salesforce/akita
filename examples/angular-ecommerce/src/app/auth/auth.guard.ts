import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './state/auth.query';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authQuery: AuthQuery, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authQuery.isLoggedIn() === true) {
      this.router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
  }
}
