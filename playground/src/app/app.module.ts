import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { ProductPageComponent } from './product-page/product-page.component';
import { NavComponent } from './nav/nav.component';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [AppComponent, NavComponent, ProductPageComponent],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, ProductsModule, CartModule, AuthModule],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
