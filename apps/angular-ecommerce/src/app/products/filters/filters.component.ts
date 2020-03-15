import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductsService } from '../state/products.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ProductsQuery } from '../state/products.query';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  filters = new FormGroup({
    condition: new FormControl(),
    location: new FormControl(),
    deliveryOption: new FormControl(false)
  });

  constructor(private productsService: ProductsService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.filters.patchValue(this.productsQuery.filters);

    this.filters.valueChanges
      .pipe(
        tap(() => this.productsService.invalidateCache()),
        untilDestroyed(this)
      )
      .subscribe(filters => this.productsService.updateFilters(filters));
  }

  ngOnDestroy() {}
}
