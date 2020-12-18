import { Injectable, OnDestroy, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Actions } from './actions';

@Injectable({
  providedIn: 'root',
})
export class ModuleManager implements OnDestroy {
  effectInstanceSources: Type<any>[] = [];
  destroyEffects$ = new Subject();

  constructor(private actions$: Actions) {}

  addEffectInstance(effectInstance) {
    this.effectInstanceSources.push(effectInstance);
    this.subscribeToEffects(effectInstance);
  }

  subscribeToEffects(effectInstance) {
    for (let key in effectInstance) {
      const property = effectInstance[key];
      if (property.hasOwnProperty('isEffect') && property.isEffect) {
        property.pipe(takeUntil(this.destroyEffects$)).subscribe((actionOrSkip) => this.dispatchAction(property, actionOrSkip));
      }
    }
  }

  private checkAction(action) {
    if (action.hasOwnProperty('type')) return true;
    throw new TypeError('Make sure to provide a valid action type or set the option {dispatch: false}');
  }

  private dispatchAction(property, actionOrSkip) {
    if (property.dispatchAction) {
      this.checkAction(actionOrSkip);
      this.actions$.dispatch(actionOrSkip);
    }
  }

  ngOnDestroy() {
    // modules aren't supposed to be destroyed; might not be needed
    this.destroyEffects$.next();
    this.effectInstanceSources = [];
  }
}
