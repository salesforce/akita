import { Injectable, Type } from '@angular/core';

// todo test integrated with modules after code change

@Injectable()
export class ModuleManager {
  rootInit: boolean;
  // can be used to keep track of instantiated effects
  effectInstanceSources: Type<any>[] = [];

  constructor() {
    this.checkRootInit();
    this.setRootInit();
  }

  setRootInit() {
    this.rootInit = true;
  }

  checkRootInit() {
    if (this.rootInit) throw TypeError('Init');
  }

  addEffectInstance(effect) {
    this.effectInstanceSources.push(effect);
  }
}
