import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DirtyCheck, EntityDirtyCheck, ID } from '../../../../akita/src';
import { Widget, WidgetsQuery, WidgetsService } from './state';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit {
  dirtyCheck: DirtyCheck;
  collection: EntityDirtyCheck<Widget>;
  widgets$: Observable<Widget[]>;

  constructor(private widgetsQuery: WidgetsQuery, private widgetService: WidgetsService) {}

  ngOnInit() {
    this.widgetService.add();
    this.widgets$ = this.widgetsQuery.selectAll();
    this.collection = new EntityDirtyCheck(this.widgetsQuery);
    this.collection.setHead();
    this.dirtyCheck = new DirtyCheck(this.widgetsQuery);
    this.dirtyCheck.setHead();
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
