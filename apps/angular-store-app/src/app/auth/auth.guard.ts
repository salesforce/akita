import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthQuery } from './state/auth.query';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, private authQuery: AuthQuery) {}

  canActivate(): Observable<boolean> {
    // For sync storage
    return this.authQuery.isLoggedIn$.pipe(
      map(isAuth => {
        if (isAuth) {
          return true;
        }
        this.router.navigateByUrl('login');
        return false;
      }),
      take(1)
    );

    // For async storage
    // return combineLatest([
    //   this.authQuery.isLoggedIn$,
    //   selectPersistStateInit(),
    // ]).pipe(
    //   map(([isAuth]) => {
    //     if(isAuth) {
    //       return true;
    //     }
    //     this.router.navigateByUrl('login');
    //     return false;
    //   }),
    //   take(1)
    // );
  }
}
