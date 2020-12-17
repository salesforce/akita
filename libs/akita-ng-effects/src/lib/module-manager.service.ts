import { Injectable, OnDestroy, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModuleManager implements OnDestroy {
  effectInstanceSources: Type<any>[] = [];
  destroyEffects$ = new Subject();

  addEffectInstance(effectInstance) {
    this.effectInstanceSources.push(effectInstance);
    this.subscribeToEffects(effectInstance);
  }

  subscribeToEffects(effectInstance) {
    for (let key in effectInstance) {
      const property = effectInstance[key];
      if (property.hasOwnProperty('isEffect') && property.isEffect) {
        console.log(property.name);
        property.pipe(takeUntil(this.destroyEffects$)).subscribe();
      }
    }
  }

  ngOnDestroy() {
    // modules aren't supposed to be destroyed; might not be needed
    this.destroyEffects$.next();
    this.effectInstanceSources = [];
  }
}
