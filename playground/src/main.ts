import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode, persistState } from '../../akita/src';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

persistState({
  key: 'akitaPlayground',
  include: ['auth.token', 'todos'],
  preStorageUpdate: function(storeName, state) {
    console.log(`preStorageUpdate`, storeName, state);
    return state;
  },
  preStoreUpdate(storeName: string, state: any) {
    console.log(`preStoreUpdate`, storeName, state);
    return state;
  }
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
