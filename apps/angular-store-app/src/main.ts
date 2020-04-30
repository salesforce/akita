import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, mapTo, publish, switchMap } from 'rxjs/operators';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

const storage = persistState({
  key: 'akitaPlayground',
  include: ['auth.token', 'todos'],
  preStorageUpdateOperator: () => {
    return (source$) => {
      return source$.pipe(
        publish((multicasted$) => {
          const debounced$ = multicasted$.pipe(debounceTime(2000));
          const unload$ = multicasted$.pipe(switchMap((data) => fromEvent(window, 'unload').pipe(mapTo(data))));

          return merge(debounced$, unload$);
        })
      );
    };
  },
});

platformBrowserDynamic([{ provide: 'persistStorage', useValue: storage }])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
