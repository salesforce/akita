import { Injectable } from '@angular/core';
import { Widget } from './widget.model';
import { EntityState, EntityStore, StoreConfig } from '../../../../../akita/src';

export interface State extends EntityState<Widget> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'widgets' })
export class WidgetsStore extends EntityStore<State, Widget> {
  constructor() {
    super();
  }
}
