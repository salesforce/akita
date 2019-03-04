import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { akitaConfig, enableAkitaProdMode, persistState } from '../../akita/src';
import * as localForage from 'localforage';

localForage.config({
  driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: 'Akita',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'akita-storage', // Should be alphanumeric, with underscores.
  description: 'some description'
});

akitaConfig({
  resettable: true
});

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

const storage = persistState({ include: ['auth.token', 'todos'], storage: localForage });

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
