import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode } from '@datorama/akita';
import { persistState } from '@datorama/akita/src/plugins';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

const storage = persistState({
  include: ['todos']
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
