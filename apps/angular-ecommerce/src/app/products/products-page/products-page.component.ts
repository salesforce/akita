import { Component, OnInit } from '@angular/core';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { BaseProduct } from '../state/product.model';
import { ProductsService } from '../state/products.service';
import { ProductsQuery } from '../state/products.query';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent implements OnInit {
  isLoading$: Observable<boolean>;
  products$: Observable<BaseProduct[]>;

  constructor(private productsService: ProductsService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.isLoading$ = this.productsQuery.selectLoading();
    this.products$ = this.productsQuery.selectAll();

    combineLatest([this.productsQuery.selectHasCache(), this.productsQuery.selectFilters$, this.productsQuery.selectSearchTerm$])
      .pipe(
        switchMap(([cached, filters, term]) => {
          return cached ? EMPTY : this.productsService.getAll(term, filters);
        }),
        untilDestroyed(this)
      )
      .subscribe({
        error() {
          // show error
        }
      });
  }

  ngOnDestroy() {}
}
