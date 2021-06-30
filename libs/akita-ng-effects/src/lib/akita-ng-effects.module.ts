import { Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { _FEATURE_EFFECTS, _ROOT_EFFECTS, FEATURE_EFFECT_INSTANCES, ROOT_EFFECT_INSTANCES } from './tokens';
import { EffectsRootModule } from './effect-root.module';
import { Actions } from './actions';
import { EffectsFeatureModule } from './effect-feature.module';
import { ModuleManager } from './module-manager.service';

const registeredEffects = new WeakSet();

@NgModule({})
export class AkitaNgEffectsModule {
  static forRoot(rootEffects: Type<any>[] = []): ModuleWithProviders<EffectsRootModule> {
    return {
      ngModule: EffectsRootModule,
      providers: [
        ModuleManager,
        Actions,
        rootEffects,
        {
          provide: _ROOT_EFFECTS,
          useValue: [rootEffects],
        },
        {
          provide: ROOT_EFFECT_INSTANCES,
          useFactory: createEffectInstances,
          deps: [Injector, _ROOT_EFFECTS],
        },
      ],
    };
  }

  static forFeature(featureEffects: Type<any>[] = []): ModuleWithProviders<EffectsFeatureModule> {
    console.log(featureEffects);
    return {
      ngModule: EffectsFeatureModule,
      providers: [
        featureEffects,
        {
          provide: _FEATURE_EFFECTS,
          useValue: featureEffects,
          multi: true,
        },
        {
          provide: FEATURE_EFFECT_INSTANCES,
          multi: true,
          useFactory: createEffectInstances,
          deps: [Injector, _FEATURE_EFFECTS],
        },
      ],
    };
  }
}

export function createEffectInstances(injector: Injector, effectGroups: Type<any>[][]): any[] {
  const mergedEffects: Type<any>[] = [];

  for (const effectGroup of effectGroups) {
    mergedEffects.push(...effectGroup);
  }

  // todo we shouldn't use a map to avoid registering the effects twice;
  // fix the underlying issue for feature is called twice
  const effectInstances = mergedEffects.reduce((acc, effect) => {
    if (registeredEffects.has(effect)) {
      return acc;
    } else {
      registeredEffects.add(effect);
      acc.push(injector.get(effect));
    }
    return acc;
  }, []);

  return effectInstances;
}
