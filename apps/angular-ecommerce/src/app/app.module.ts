import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ShellModule } from './shell/shell.module';
import { CartModule } from './cart/cart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    environment.production ? [] : AkitaNgDevtools.forRoot({ shallow: false, sortAlphabetically: true }),
    ProductsModule,
    CartModule,
    AuthModule,
    ShellModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
