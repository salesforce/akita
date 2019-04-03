import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WidgetsState, WidgetsStore } from './widgets.store';
import { Widget } from './widget.model';

@Injectable({ providedIn: 'root' })
export class WidgetsQuery extends QueryEntity<WidgetsState, Widget> {
  constructor(protected store: WidgetsStore) {
    super(store);
  }
}
