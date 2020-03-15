import { Component } from '@angular/core';
import { AuthService } from '../../auth/state/auth.service';
import { Router } from '@angular/router';
import { CartQuery } from '../../cart/state/cart.query';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  cartCount$ = this.cartQuery.selectCount();

  constructor(private cartQuery: CartQuery, private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
