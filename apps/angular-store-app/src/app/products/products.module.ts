import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { ProductsEffects } from './state/products.effects';

const publicApi = [ProductsComponent, ProductComponent];

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AkitaNgEffectsModule.forFeature([ProductsEffects])],
  declarations: [publicApi],
  exports: [publicApi],
})
export class ProductsModule {}
