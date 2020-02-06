import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
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

const storage = persistState({
  key: 'akitaPlayground',
  include: ['auth.token']
});

platformBrowserDynamic([{ provide: 'persistStorage', useValue: storage }])
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
