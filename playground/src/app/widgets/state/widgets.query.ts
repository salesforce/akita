import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { State, WidgetsStore } from './widgets.store';
import { Widget } from './widget.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetsQuery extends QueryEntity<State, Widget> {
  constructor(protected store: WidgetsStore) {
    super(store);
  }
}
