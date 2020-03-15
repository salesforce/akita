import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { FiltersComponent } from './filters/filters.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductsPageComponent } from './products-page/products-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchProductComponent } from './search-product/search-product.component';

@NgModule({
  declarations: [ProductComponent, FiltersComponent, ProductPageComponent, ProductsPageComponent, SearchProductComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProductsModule {}
