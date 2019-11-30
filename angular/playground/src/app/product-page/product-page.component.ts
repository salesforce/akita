import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ProductsService } from '../products/state/products.service';
import { ProductsQuery } from '../products/state/products.query';

@Component({
  template: `
    <div *ngIf="(product$ | async) as product" class="padding">
      <h1>{{ product.title }}</h1>
      <h6>{{ product.description }}</h6>
    </div>
  `
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product$ = this.productsQuery.selectEntity(this.productId);

  constructor(private activatedRoute: ActivatedRoute, private productsService: ProductsService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter(id => !this.productsQuery.hasEntity(id)),
        untilDestroyed(this),
        switchMap(id => this.productsService.getProduct(id))
      )
      .subscribe();
  }

  get productId() {
    return this.activatedRoute.snapshot.params.id;
  }

  ngOnDestroy() {}
}
