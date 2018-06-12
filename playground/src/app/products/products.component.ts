import { Component, OnInit } from '@angular/core';
import { Product, ProductsQuery, ProductsService } from './state';
import { Observable } from 'rxjs';
import { CartService } from '../cart/state';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';
import { TodosService } from '@datorama/playground/src/app/todos-app/state';

@Component({
  selector: 'app-products',
  templateUrl: `./products.component.html`
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  search = new FormControl();

  constructor(private productsService: ProductsService, private to: TodosService, private cartService: CartService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();
    this.products$ = this.search.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.productsQuery.getProducts(value))
    );
  }

  /**
   *
   * @param {ID} id
   */
  addProductToCart({ id }: Product) {
    this.cartService.addProductToCart(id);
  }

  /**
   *
   * @param {ID} id
   */
  subtract({ id }: Product) {
    this.cartService.subtract(id);
  }
}
