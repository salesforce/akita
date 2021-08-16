import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { ROOT_EFFECT_INSTANCES } from './tokens';
import { Actions } from './actions';
import { ModuleManager } from './module-manager.service';

@NgModule()
export class EffectsRootModule {
  constructor(private moduleManager: ModuleManager, private actions: Actions, @Inject(ROOT_EFFECT_INSTANCES) rootEffects: any[], @Optional() @SkipSelf() private parentModule?: EffectsRootModule) {
    this.rootGuard();
    rootEffects.forEach((effect) => this.moduleManager.subscribeToEffects(effect));
  }

  rootGuard() {
    if (this.parentModule) {
      throw new Error('EffectsRootModule is already loaded. Import it in the AppModule only');
    }
  }
}
