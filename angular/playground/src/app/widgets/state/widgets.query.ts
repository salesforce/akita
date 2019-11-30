import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WidgetsState, WidgetsStore } from './widgets.store';

@Injectable({ providedIn: 'root' })
export class WidgetsQuery extends QueryEntity<WidgetsState> {
  constructor(protected store: WidgetsStore) {
    super(store);
  }
}
