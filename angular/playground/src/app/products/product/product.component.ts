import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../state/products.model';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./product.component.html`
})
export class ProductComponent {
  @Input() product: Product;
  @Output() add = new EventEmitter<Product>();
  @Output() subtract = new EventEmitter<Product>();
}
