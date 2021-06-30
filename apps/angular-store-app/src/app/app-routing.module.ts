import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { CartComponent } from './cart/cart.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    component: ProductsComponent,
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    component: ProductPageComponent,
    path: 'product/:id',
    canActivate: [AuthGuard],
  },
  {
    component: CartComponent,
    path: 'cart',
    canActivate: [AuthGuard],
  },
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    path: 'todos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./todos-app/todos.module').then((m) => m.TodosModule),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule),
  },
  {
    path: 'stories',
    loadChildren: () => import('./stories/stories.module').then((m) => m.StoriesModule),
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.module').then((m) => m.MoviesModule),
  },
  {
    path: 'widgets',
    loadChildren: () => import('./widgets/widgets.module').then((m) => m.WidgetsModule),
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then((m) => m.PostsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
