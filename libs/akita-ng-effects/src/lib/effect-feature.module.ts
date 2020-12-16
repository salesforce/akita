import { Inject, NgModule } from '@angular/core';
import { FEATURE_EFFECT_INSTANCES } from './tokens';
import { ModuleManager } from './module-manager.service';

@NgModule()
export class EffectsFeatureModule {
  constructor(
    private moduleManager: ModuleManager,
    // this will instantiate the effects; keep order
    @Inject(FEATURE_EFFECT_INSTANCES) featureEffects: any[]
  ) {
    featureEffects.forEach((effect) => this.moduleManager.addEffectInstance(effect));
  }
}
