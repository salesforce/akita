import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Filter } from '../../../../../akita/src/plugins/filters/filters-store';
import { ProductPlant, ProductsFiltersService } from '../state';
import { searchObjFunction } from '../../../../../akita/src/plugins/filters/filters-plugin';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-filters-form',
  templateUrl: './filters-form.component.html',
  styles: []
})
export class FiltersFormComponent implements OnInit, OnDestroy {

  search = new FormControl();
  sortControl = new FormControl('title');
  categoryControl = new FormControl();
  size = new FormControl();
  fastDeliveryControl = new FormControl();


  category: string;
  filterFastDelivery: boolean = false;
  private filters$: Observable<Filter[]>;

  constructor(private productsService: ProductsFiltersService) { }

  ngOnInit() {
    this.search.setValue(this.productsService.getFilterValue('search'), {emitEvent: false});
    this.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      this.productsService.setFilter({id: 'search', value: search, name: 'Search :' + search,
        function: (value: ProductPlant, index, array) => {
          return searchObjFunction(search, value);
        }})
    });

    this.categoryControl.setValue(this.productsService.getFilterValue('category'), {emitEvent: false});
    this.categoryControl.valueChanges.pipe(untilDestroyed(this)).subscribe((category) => {
      this.productsService.setFilter({id: 'category', value: category,
        function: (value: ProductPlant, index, array) => value.category === category})
    });

    this.sortControl.valueChanges.pipe(untilDestroyed(this)).subscribe((sortBy: string) => {
      this.productsService.setOrder(sortBy.slice(1), sortBy.slice(0, 1));
    });
    this.sortControl.setValue(this.productsService.getSortValue());

    this.filterFastDelivery = this.productsService.getFilterValue('fastDelivery');
    this.fastDeliveryControl.setValue(this.filterFastDelivery, {emitEvent: false});
    this.size.setValue(this.productsService.getFilterValue('size'), {emitEvent: false});





    this.filters$ = this.productsService.selectFilters();
  }

  filterSize(size: string) {
    this.productsService.setFilter({id: 'size', name: 'Size :' +size, value: size, function: (value: ProductPlant, index, array) => value.size === size})
  }


  changeFastDelivery() {
    this.filterFastDelivery = !this.filterFastDelivery;
    if (this.filterFastDelivery) {
      this.productsService.setFilter({id: 'fastDelivery', name: 'Only fast Delivery', value: this.filterFastDelivery, order: 1, function: (value: ProductPlant, index, array) => value.rapidDelivery})
    } else {
      this.removeFilter('fastDelivery');
    }
  }

  removeFilter(id: any) {
    switch (id) {
      case 'search':
        this.search.reset('');
        break;
      case 'category':
        this.categoryControl.reset();
        break;

      case 'fastDelivery':
        this.fastDeliveryControl.setValue(false);
        break;

      case 'size':
        this.size.reset();
        break;
    }
    this.productsService.removeFilter(id);
  }

  ngOnDestroy(): void {
  }

}
