import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode } from '../../akita/src';
import * as localForage from 'localforage';

// localForage.config({
//   driver: localForage.INDEXEDDB,
//   name: 'Akita',
//   version: 1.0,
//   storeName: 'akita-storage'
// });

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
