import { Component, OnInit } from '@angular/core';
import { ProductPlant, ProductsFiltersQuery, ProductsFiltersService } from './state';
import { Observable, combineLatest } from 'rxjs';
import { CartService } from '../cart/state';
import { ContainerBasedQuery, ContainerBasedService, ContainerBasedStore } from '../state';

@Component({
  selector: 'app-products-list',
  providers: [ContainerBasedService, ContainerBasedStore, ContainerBasedQuery],
  templateUrl: `./products-list.component.html`
})
export class ProductsListComponent implements OnInit {
  products$: Observable<ProductPlant[]>;
  loading$: Observable<boolean>;

  constructor( private productsService: ProductsFiltersService, private containerBasedService: ContainerBasedService, private cartService: CartService, private productsQuery: ProductsFiltersQuery ) {
  }

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();

    this.products$ = this.productsService.selectAll();
  }

  /**
   *
   * @param {ID} id
   */
  addProductToCart( { id }: ProductPlant ) {
    this.cartService.addProductToCart(id);
  }

  /**
   *
   * @param {ID} id
   */
  subtract( { id }: ProductPlant ) {
    this.cartService.subtract(id);
  }
}
