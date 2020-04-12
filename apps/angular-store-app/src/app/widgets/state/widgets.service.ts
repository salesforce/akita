import { Injectable } from '@angular/core';
import { WidgetsStore } from './widgets.store';
import { createWidget } from './widget.model';
import { ID } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class WidgetsService {
  constructor(private widgetsStore: WidgetsStore) {}

  initWidgets() {
    const widgets = [createWidget(), createWidget(), createWidget(), createWidget(), createWidget()];
    this.widgetsStore.set(widgets);
  }

  updateWidget(id: ID, name: string) {
    this.widgetsStore.update(id, { name });
  }

  add() {
    this.widgetsStore.add(createWidget());
  }

  remove(id?: ID) {
    this.widgetsStore.remove(id);
  }

  updateName(name: string) {
    this.widgetsStore.update({ name });
  }

  addActive(id: ID) {
    this.widgetsStore.addActive(id);
  }

  removeActive(id: ID) {
    this.widgetsStore.removeActive(id);
  }

  toggleActive(id: ID) {
    this.widgetsStore.toggleActive(id);
  }
}
