import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpMethod, NgEntityServiceGlobalConfig, NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { NavComponent } from './nav/nav.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductsModule } from './products/products.module';

import { ENVIRONMENT_INITIALIZER, inject, NgZone } from '@angular/core';
import { akitaDevtools, DevtoolsOptions } from '@datorama/akita';

export function provideAkitaDevtools(options: Partial<DevtoolsOptions> = {}) {
  return {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => {
        akitaDevtools(inject(NgZone), options);
      };
    },
  };
}

@NgModule({
  declarations: [AppComponent, NavComponent, ProductPageComponent],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, ProductsModule, CartModule, AuthModule, AkitaNgRouterStoreModule],
  providers: [
    AuthGuard,
    provideAkitaDevtools(),
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useFactory: function () {
        return {
          baseUrl: 'https://jsonplaceholder.typicode.com',
          httpMethods: {
            PUT: HttpMethod.PATCH,
          },
        } as NgEntityServiceGlobalConfig;
      },
      deps: [],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
