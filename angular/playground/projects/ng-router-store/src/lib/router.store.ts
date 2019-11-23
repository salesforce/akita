import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { Store, StoreConfig } from '@datorama/akita';

export type RouterState<T = RouterStateSnapshot> = {
  state: T | null;
  navigationId: number | null;
};

export function createInitialRouterState(): RouterState {
  return {
    state: null,
    navigationId: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'router' })
export class RouterStore extends Store<RouterState> {
  constructor() {
    super(createInitialRouterState());
  }
}
