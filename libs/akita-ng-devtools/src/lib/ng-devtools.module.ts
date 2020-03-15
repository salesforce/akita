import { APP_INITIALIZER, ModuleWithProviders, NgModule, NgZone, InjectionToken, Inject, Injectable } from '@angular/core';
import { akitaDevtools, DevtoolsOptions } from '@datorama/akita';

export const DEVTOOLS_OPTIONS = new InjectionToken<DevtoolsOptions>('DevtoolsOptions');

@Injectable({
  providedIn: 'root'
})
export class AkitaDevtools {
  constructor(private ngZone: NgZone, @Inject(DEVTOOLS_OPTIONS) private options: DevtoolsOptions) {
    akitaDevtools(this.ngZone, this.options);
  }
}

// auto initialize the devtools
export function d() {}

export function init(akitaDevtools: AkitaDevtools) {
  return d;
}

@NgModule({})
export class AkitaNgDevtools {
  public static forRoot(options?: Partial<DevtoolsOptions>): ModuleWithProviders<AkitaNgDevtools> {
    return {
      ngModule: AkitaNgDevtools,
      providers: [
        {
          provide: DEVTOOLS_OPTIONS,
          useValue: options
        },
        {
          provide: APP_INITIALIZER,
          useFactory: init,
          deps: [AkitaDevtools],
          multi: true
        }
      ]
    };
  }
}
