import { Injectable } from '@angular/core';
import { Widget } from './widget.model';
import { EntityState, EntityStore, StoreConfig, MultiActive } from '@datorama/akita';

export interface State extends EntityState<Widget>, MultiActive {
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
