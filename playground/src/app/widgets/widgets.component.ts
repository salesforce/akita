import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DirtyCheckPlugin, EntityDirtyCheckPlugin, ID } from '../../../../akita/src';
import { Widget, WidgetsQuery, WidgetsService } from './state';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit {
  dirtyCheck: DirtyCheckPlugin;
  collection: EntityDirtyCheckPlugin<Widget>;
  widgets$: Observable<Widget[]>;

  constructor(private widgetsQuery: WidgetsQuery, private widgetService: WidgetsService) {}

  ngOnInit() {
    this.widgetService.add();
    this.widgets$ = this.widgetsQuery.selectAll();
    this.collection = new EntityDirtyCheckPlugin(this.widgetsQuery).setHead();
    this.dirtyCheck = new DirtyCheckPlugin(this.widgetsQuery).setHead();
  }

  updateWidget(id: ID, name: string) {
    this.widgetService.updateWidget(id, name);
  }

  revert(id?) {
    if (id) {
      this.collection.reset(id);
    } else {
      this.dirtyCheck.reset();
    }
  }
}
