import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TodoFilter, VISIBILITY_FILTER } from './filter.model';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-todos-filters',
  template: `
    <div class="input-field col s12">
      <select [formControl]="control" class="browser-default">
        <option *ngFor="let filter of filters" [ngValue]="filter.value">{{ filter.label }} </option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosFiltersComponent implements OnInit, OnDestroy {
  _active;
  @Input()
  set active(filter: VISIBILITY_FILTER) {
    this._active = filter;
    if (this.control) {
      this.control.patchValue(filter, { emitEvent: false });
    }
  }
  @Input()
  filters: TodoFilter[];
  @Output()
  update = new EventEmitter<VISIBILITY_FILTER>();

  control: FormControl;

  ngOnInit() {
    this.control = new FormControl(this._active);

    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe(c => {
      this.update.emit(c);
    });
  }

  ngOnDestroy() {}
}
