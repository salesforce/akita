import { Component, OnInit } from '@angular/core';
import { ProductsQuery } from '../state/products.query';
import { ProductsService } from '../state/products.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CartService } from '../../cart/state/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../state/product.model';

@Component({
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product$ = this.productsQuery.selectProduct(this.productId);
  quantity = new FormControl(1);

  get productId() {
    return this.activatedRoute.snapshot.params.id;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private toastr: ToastrService,
    private productsService: ProductsService,
    private productsQuery: ProductsQuery
  ) {}

  ngOnInit() {
    if (this.productsQuery.hasProduct(this.productId) === false) {
      this.productsService.getProduct(this.productId).subscribe({
        error() {
          // show error
        }
      });
    }
  }

  addToCart(product: Product) {
    this.cartService.add(product, this.quantity.value);
    this.toastr.success(`Added to cart`);
  }
}
