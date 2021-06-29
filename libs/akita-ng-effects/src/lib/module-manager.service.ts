import { Injectable, OnDestroy, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Actions } from './actions';
import { Action, Effect } from './types';

@Injectable({
  providedIn: 'root',
})
export class ModuleManager implements OnDestroy {
  effectInstanceSources: Type<any>[] = [];
  destroyEffects$ = new Subject();

  constructor(private actions$: Actions) {}

  addEffectInstance(effectInstance: Type<any>): void {
    this.effectInstanceSources.push(effectInstance);
    this.subscribeToEffects(effectInstance);
  }

  subscribeToEffects(effectInstance: Type<any>): void {
    for (let key in effectInstance) {
      const property: Effect = effectInstance[key];
      if (property.isEffect) {
        property.pipe(takeUntil(this.destroyEffects$)).subscribe((actionOrSkip) => {
          this.dispatchAction(property, actionOrSkip);
        });
      }
    }
  }

  private dispatchAction(property: Effect, actionOrSkip: Action | Record<any, any>) {
    if (property.dispatchAction && this.checkAction(actionOrSkip)) {
      this.actions$.dispatch(actionOrSkip);
    }
  }

  private checkAction(action: Action | any): action is Action & Record<'type', any> {
    if (action.type) {
      return true;
    }
    throw new TypeError('Make sure to provide a valid action type or set the option {dispatch: false}');
  }

  ngOnDestroy(): void {
    // modules aren't supposed to be destroyed; might not be needed
    this.destroyEffects$.next();
    this.effectInstanceSources = [];
  }
}
