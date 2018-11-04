import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { akitaConfig, enableAkitaProdMode, persistState } from "../../akita/src";

akitaConfig({
  resettable: true
});

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

const storage = persistState({ include: ['auth.token'] });

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
