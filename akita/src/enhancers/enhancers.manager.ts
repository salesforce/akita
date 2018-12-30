import { AkitaConfig } from '../api/config';
import { Action } from '../api/store';

interface SetState<T, TResult> {
  (state: T): TResult;
}

export interface PreUpdate<T, TResult> {
  (): (state: T, action: Action, storeName: string) => TResult;
}

export class AkitaEnhancerManager {
  constructor() {}

  runEnhancer(state: any, action: Action, storeName: string, enhancer: any) {
    return enhancer()(state, action, storeName);
  }
}
