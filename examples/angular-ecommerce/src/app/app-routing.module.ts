import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './products/product-page/product-page.component';
import { ProductsPageComponent } from './products/products-page/products-page.component';
import { CartPageComponent } from './cart/cart-page/cart-page.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProductsPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    component: ProductPageComponent
  },
  {
    path: 'cart',
    component: CartPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
