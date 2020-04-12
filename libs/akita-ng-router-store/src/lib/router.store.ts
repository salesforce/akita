import { Injectable } from '@angular/core';
import { Store, StoreConfig, HashMap } from '@datorama/akita';

export type ActiveRouteState = {
  url: string;
  urlAfterRedirects: string;
  fragment: string;
  params: HashMap<any>;
  queryParams: HashMap<any>;
  data: HashMap<any>;
  navigationExtras: HashMap<any> | undefined;
};

export type RouterState = {
  state: ActiveRouteState | null;
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
