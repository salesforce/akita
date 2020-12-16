import { Inject, NgModule } from '@angular/core';
import { ROOT_EFFECT_INSTANCES } from './tokens';
import { Actions } from './actions';
import { ModuleManager } from './module-manager.service';

@NgModule()
export class EffectsRootModule {
  constructor(
    private moduleManager: ModuleManager,
    // this will instantiate the effects; keep order
    private actions: Actions,
    @Inject(ROOT_EFFECT_INSTANCES) rootEffects: any[]
  ) {
    rootEffects.forEach((effect) => this.moduleManager.addEffectInstance(effect));
  }
}
