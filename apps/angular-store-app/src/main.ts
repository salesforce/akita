import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

const storage = persistState({
  key: 'akitaPlayground',
  include: ['auth.token', 'todos'],
});

platformBrowserDynamic([{ provide: 'persistStorage', useValue: storage }])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
