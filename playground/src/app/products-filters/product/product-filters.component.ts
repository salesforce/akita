import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductPlant } from '../state';

@Component({
  selector: 'app-product-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .app-product-filter {
      min-height: 600px;
      max-height: 600px;
    }
    .app-product-filter .card-image img {
      min-height: 250px;
      height: 250px;
      max-height: 250px;
    }
  `],
  templateUrl: `./product-filters.component.html`
})
export class ProductFiltersComponent {
  @Input() product: ProductPlant;
  @Output() add = new EventEmitter<ProductPlant>();
  @Output() subtract = new EventEmitter<ProductPlant>();
}
