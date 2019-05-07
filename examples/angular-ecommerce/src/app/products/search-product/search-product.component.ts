import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ProductsService } from '../state/products.service';
import { ProductsQuery } from '../state/products.query';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html'
})
export class SearchProductComponent implements OnInit {
  searchControl = new FormControl();

  constructor(private productsService: ProductsService,
              private productsQuery: ProductsQuery) { }

  ngOnInit() {
    this.searchControl.patchValue(this.productsQuery.searchTerm);

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((term) => this.productsService.updateSearchTerm(term));
  }

}
