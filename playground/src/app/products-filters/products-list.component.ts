import { Component, OnInit } from '@angular/core';
import { ProductPlant, ProductsFiltersQuery, ProductsFiltersService } from './state';
import { Observable, combineLatest } from 'rxjs';
import { CartService } from '../cart/state';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';
import { ContainerBasedQuery, ContainerBasedService, ContainerBasedStore } from '../state';
import { Filter } from '../../../../akita/src/plugins/filters/filters-store';
import { searchObjFunction } from '../../../../akita/src/plugins/filters/filters-plugin';

@Component({
  selector: 'app-products-list',
  providers: [ContainerBasedService, ContainerBasedStore, ContainerBasedQuery],
  templateUrl: `./products-list.component.html`
})
export class ProductsListComponent implements OnInit {
  products$: Observable<ProductPlant[]>;
  loading$: Observable<boolean>;




  constructor(private productsService: ProductsFiltersService,
              private containerBasedService: ContainerBasedService,
              private cartService: CartService, private productsQuery: ProductsFiltersQuery) {}

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();

    /*this.products$ = combineLatest(this.search.valueChanges.pipe(startWith('')), this.sortControl.valueChanges.pipe(startWith('title'))).pipe(
      switchMap(([term, sortBy]) => this.productsQuery.getProducts(term, sortBy as keyof ProductPlant))
    );*/


    this.products$ = this.productsService.selectAll();
  }

  /**
   *
   * @param {ID} id
   */
  addProductToCart({ id }: ProductPlant) {
    this.cartService.addProductToCart(id);
  }

  /**
   *
   * @param {ID} id
   */
  subtract({ id }: ProductPlant) {
    this.cartService.subtract(id);
  }


}
