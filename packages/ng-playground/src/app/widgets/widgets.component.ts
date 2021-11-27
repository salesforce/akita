import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DirtyCheckPlugin, EntityDirtyCheckPlugin, ID } from '@datorama/akita';
import { resetId, Widget } from './state/widget.model';
import { WidgetsService } from './state/widgets.service';
import { WidgetsQuery } from './state/widgets.query';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit, OnDestroy {
  collection: DirtyCheckPlugin;
  widgetsSpecific: EntityDirtyCheckPlugin;
  widgets$: Observable<Widget[]>;
  activeWidgets$: Observable<Widget[]>;
  dashoboardName$: Observable<string>;

  constructor(
    private widgetsQuery: WidgetsQuery,
    private widgetService: WidgetsService
  ) {}

  ngOnInit() {
    if (this.widgetsQuery.hasEntity() === false) {
      this.widgetService.initWidgets();
    }
    this.dashoboardName$ = this.widgetsQuery.select(state => state.name);
    this.widgets$ = this.widgetsQuery.selectAll();
    this.activeWidgets$ = this.widgetsQuery.selectActive();
    this.collection = new DirtyCheckPlugin(this.widgetsQuery, {
      watchProperty: 'entities'
    }).setHead();
    this.widgetsSpecific = new EntityDirtyCheckPlugin(
      this.widgetsQuery
    ).setHead();
  }

  updateName(nameInput) {
    this.widgetService.updateName(nameInput.value);
  }

  updateWidget(id: ID, name: string) {
    this.widgetService.updateWidget(id, name);
  }

  add() {
    this.widgetService.add();
  }

  remove(id?: ID) {
    this.widgetService.remove(id);
  }

  revert(id) {
    this.widgetsSpecific.reset(id);
  }

  revertStore() {
    resetId(5);
    this.collection.reset();
  }

  ngOnDestroy() {
    resetId();
    this.collection.destroy();
    this.widgetsSpecific.destroy();
  }

  addActive(id: ID) {
    this.widgetService.addActive(id);
  }

  removeActive(id: ID) {
    this.widgetService.removeActive(id);
  }

  toggleActive(id: ID) {
    this.widgetService.toggleActive(id);
  }
}
