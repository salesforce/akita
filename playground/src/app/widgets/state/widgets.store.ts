import { Injectable } from '@angular/core';
import { Widget } from './widget.model';
import { EntityState, EntityStore, StoreConfig, MultiActiveState } from '@datorama/akita';

export interface State extends EntityState<Widget>, MultiActiveState {
  name: string;
}

const initState = {
  name: 'Akita widgets',
  active: []
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'widgets' })
export class WidgetsStore extends EntityStore<State, Widget> {
  constructor() {
    super(initState);
  }
}
