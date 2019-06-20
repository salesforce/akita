import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode, persistState } from '../../akita/src';
import { debounceTime } from 'rxjs/operators';
import * as localForage from 'localforage';

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'Akita',
  version: 1.0,
  storeName: 'akita-storage'
});

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

persistState({
  key: 'akitaPlayground',
  include: ['auth.token', 'todos'],
  // storage: localForage,
  preStorageUpdateOperator: () => debounceTime(1000),
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
