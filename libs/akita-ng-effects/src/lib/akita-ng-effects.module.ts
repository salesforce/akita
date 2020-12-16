import { Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { _FEATURE_EFFECTS, _ROOT_EFFECTS, FEATURE_EFFECT_INSTANCES, ROOT_EFFECT_INSTANCES } from './tokens';
import { EffectsRootModule } from './effect-root.module';
import { Actions } from './actions';
import { EffectsFeatureModule } from './effect-feature.module';
import { ModuleManager } from './module-manager.service';

// todo on destroy behavior will be implemented

// forRoot method runs twice
// https://github.com/angular/angular/issues/38376

// @internal
let initRoot = false;

@NgModule({})
export class AkitaNgEffectsModule {
  static forRoot(rootEffects: Type<any>[] = []): ModuleWithProviders<EffectsRootModule> {
    // if (initRoot) return;
    // initRoot = true;

    return {
      ngModule: EffectsRootModule,
      providers: [
        Actions,
        rootEffects,
        ModuleManager, // needs to be singleton
        {
          provide: _ROOT_EFFECTS,
          useValue: rootEffects,
        },
        {
          provide: ROOT_EFFECT_INSTANCES,
          useFactory: createEffects,
          deps: [Injector, _ROOT_EFFECTS],
        },
      ],
    };
  }

  // multiple instances of feature effects can coexist; todo keep for configuration purposes?
  static forFeature(featureEffects: Type<any>[] = []): ModuleWithProviders<EffectsFeatureModule> {
    if ( !initRoot ) throw TypeError("Use AkitaNgEffectsModule.forRoot() before creating feature effects.")

    return {
      ngModule: EffectsFeatureModule,
      providers: [
        featureEffects,
        {
          provide: _FEATURE_EFFECTS,
          useValue: featureEffects,
        },
        {
          provide: FEATURE_EFFECT_INSTANCES,
          useFactory: createEffects,
          deps: [Injector, _FEATURE_EFFECTS],
        },
      ],
    };
  }
}

export function createEffects(injector: Injector, effects: Type<any>[]): any[] {
  const mergedEffects: Type<any>[] = [];

  for (let effect of effects) {
    mergedEffects.push(effect);
  }

  return createEffectInstances(injector, mergedEffects);
}

export function createEffectInstances(injector: Injector, effects: Type<any>[]): any[] {
  return effects.map((effect) => injector.get(effect));
}
