import { Component } from '@angular/core';
import { CartQuery } from '../cart/state';
import { Observable } from 'rxjs';
import { AuthQuery, AuthService } from '../auth/state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  template: `
    <nav>
      <div class="nav-wrapper cyan lighten-2">
        <a class="brand-logo" routerLink="/">Akita Store</a>

        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li *ngIf="isLoggedIn$ | async"><a (click)="logout()">Logout</a></li>
          <li><a routerLink="todos">Todos</a></li>
          <li><a routerLink="cart">Cart <span class="new badge">{{count$ | async}}</span></a></li>
        </ul>
      </div>
    </nav>
  `
})
export class NavComponent {
  count$: Observable<number>;
  isLoggedIn$: Observable<boolean>;

  constructor(private cartQuery: CartQuery, private authService: AuthService, private authQuery: AuthQuery, private router: Router) {
    this.count$ = this.cartQuery.selectCount();
    this.isLoggedIn$ = this.authQuery.isLoggedIn$;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
