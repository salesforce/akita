import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { ProductFiltersComponent } from './product/product-filters.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StoriesComponent } from '../stories/stories/stories.component';
import { FiltersFormComponent } from './filters-form/filters-form.component';

const publicApi = [ProductsListComponent, ProductFiltersComponent];

const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
  declarations: [publicApi, FiltersFormComponent],
  exports: [publicApi]
})
export class ProductsFiltersModule {}
