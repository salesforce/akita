import { Component } from '@angular/core';
import { CartQuery } from '../cart/state';
import { Observable } from 'rxjs';
import { AuthQuery, AuthService } from '../auth/state';
import { Router } from '@angular/router';
import { resetStores } from '../../../../akita/index';

@Component({
  selector: 'app-nav',
  template: `
    <nav>
      <div class="nav-wrapper cyan lighten-2">
        <a class="brand-logo" routerLink="/">Akita Store</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a (click)="resetStores()">Reset Stores</a></li>
          <li *ngIf="isLoggedIn$ | async"><a (click)="logout()">Logout</a></li>
          <li *ngFor="let item of navItems">
            <a routerLinkActive="blue-text text-lighten-2" [routerLink]="item.toLowerCase()">{{item}}</a>
          </li>
          <li><a routerLinkActive="blue-text text-lighten-2" routerLink="cart">Cart <span class="new badge">{{count$ | async}}</span></a></li>
        </ul>
      </div>
    </nav>
  `
})
export class NavComponent {
  navItems = ['Todos', 'Contacts', 'Stories', 'Movies', 'Widgets'];
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

  resetStores() {
    resetStores();
  }
}
