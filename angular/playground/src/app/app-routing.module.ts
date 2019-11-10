import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    component: ProductsComponent,
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    component: ProductPageComponent,
    path: 'product/:id',
    canActivate: [AuthGuard]
  },
  {
    component: CartComponent,
    path: 'cart',
    canActivate: [AuthGuard]
  },
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    path: 'todos',
    canActivate: [AuthGuard],
    loadChildren: 'app/todos-app/todos.module#TodosModule'
  },
  {
    path: 'contacts',
    loadChildren: 'app/contacts/contacts.module#ContactsModule'
  },
  {
    path: 'stories',
    loadChildren: 'app/stories/stories.module#StoriesModule'
  },
  {
    path: 'movies',
    loadChildren: 'app/movies/movies.module#MoviesModule'
  },
  {
    path: 'widgets',
    loadChildren: 'app/widgets/widgets.module#WidgetsModule'
  },
  {
    path: 'posts',
    loadChildren: 'app/posts/posts.module#PostsModule'
  },
  {
    path: 'formsmanager',
    loadChildren: 'app/forms-manager/forms-manager.module#FormsManagerModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
