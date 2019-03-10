import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { inStorageAsync } from './state/auth.query';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    return inStorageAsync().pipe(
      map(inStorage => {
        if (inStorage) {
          return true;
        }
        this.router.navigateByUrl('login');

        return false;
      }),
      take(1)
    );
  }
}
