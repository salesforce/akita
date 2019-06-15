import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';
import { Product } from './state/products.model';
import { ProductsService } from './state/products.service';
import { ProductsQuery } from './state/products.query';
import { CartService } from '../cart/state/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: `./products.component.html`
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  search = new FormControl();
  sortControl = new FormControl('title');

  constructor(private productsService: ProductsService, private cartService: CartService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();

    this.products$ = combineLatest(this.search.valueChanges.pipe(startWith('')), this.sortControl.valueChanges.pipe(startWith('title'))).pipe(
      switchMap(([term, sortBy]) => this.productsQuery.getProducts(term, sortBy as keyof Product))
    );
  }

  addProductToCart({ id }: Product) {
    this.cartService.addProductToCart(id);
  }

  subtract({ id }: Product) {
    this.cartService.subtract(id);
  }
}
