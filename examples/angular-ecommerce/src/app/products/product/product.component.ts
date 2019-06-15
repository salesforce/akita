import { Component, Input } from '@angular/core';
import { BaseProduct } from '../state/product.model';

@Component({
  selector: 'app-base-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product: BaseProduct;
}
