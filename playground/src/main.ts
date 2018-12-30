import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { akitaConfig, enableAkitaProdMode, persistState } from '../../akita/src';

// enhancer test function
export function preUpdate() {
  return function(state: any, action: any, storeName: string): any {
    console.log('storeName', storeName);
    if (storeName === 'router') return state;
    console.log('state', state);
    console.log('action', action);
    return { ...state, mutated: true };
  };
}

// enhancer test function
export function preUpdateTwo() {
  return function(state: any, action: any, storeName: string): any {
    console.log('storeName', storeName);
    if (storeName === 'router') return state;
    console.log('state', state);
    console.log('action', action);
    return { ...state, mutatedTwice: true };
  };
}

akitaConfig({
  resettable: true,
  enhancers: [preUpdate, preUpdateTwo]
});

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

const storage = persistState({ include: ['auth.token'] });

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
