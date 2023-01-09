import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { combineLatest, Observable, startWith, switchMap } from 'rxjs';
import { CartService } from '../cart/state/cart.service';
import { Product } from './state/products.model';
import { ProductsQuery } from './state/products.query';
import { ProductsService } from './state/products.service';

@Component({
  selector: 'app-products',
  templateUrl: `./products.component.html`,
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  search = new UntypedFormControl();
  sortControl = new UntypedFormControl('title');

  constructor(private productsService: ProductsService, private cartService: CartService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();
    this.products$ = combineLatest([this.search.valueChanges.pipe(startWith('')), this.sortControl.valueChanges.pipe(startWith('title'))]).pipe(
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
