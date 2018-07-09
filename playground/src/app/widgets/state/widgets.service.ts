import { Injectable } from '@angular/core';
import { WidgetsStore } from './widgets.store';
import { WidgetsDataService } from './widgets-data.service';
import { createWidget } from './widget.model';
import { ID } from '../../../../../../akita/akita/src/index';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {
  constructor(private widgetsStore: WidgetsStore, private widgetsDataService: WidgetsDataService) {}

  add() {
    const widgets = [createWidget(), createWidget(), createWidget(), createWidget(), createWidget()];
    this.widgetsStore.add(widgets);
  }

  updateWidget(id: ID, name: string) {
    this.widgetsStore.update(id, { name });
  }
}
