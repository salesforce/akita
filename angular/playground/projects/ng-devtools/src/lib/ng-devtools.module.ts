import { NgModule, NgZone, InjectionToken, Inject, Optional } from '@angular/core';
import { akitaDevtools, DevtoolsOptions } from '@datorama/akita';

export const DEVTOOLS_OPTIONS = new InjectionToken<DevtoolsOptions>('DevtoolsOptions');

@NgModule({})
export class AkitaNgDevtools {
  constructor(private ngZone: NgZone, @Optional() @Inject(DEVTOOLS_OPTIONS) private options: DevtoolsOptions) {
    akitaDevtools(this.ngZone, this.options || {});
  }
}
