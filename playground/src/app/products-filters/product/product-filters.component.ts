import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductPlant } from '../state';

@Component({
  selector: 'app-product-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./product-filters.component.html`,
  styles: [`:host {
    display: block;
    width: 100%;
  }`]
})
export class ProductFiltersComponent {
  @Input()
  products: ProductPlant[];
  @Output()
  add = new EventEmitter<ProductPlant>();
  @Output()
  subtract = new EventEmitter<ProductPlant>();
}
