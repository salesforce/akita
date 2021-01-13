import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ID } from '@datorama/akita';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Todo } from '../state/todo.model';

@UntilDestroy()
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit, OnDestroy {
  @Input()
  todo: Todo;
  @Output()
  complete = new EventEmitter<Todo>();
  @Output()
  delete = new EventEmitter<ID>();

  control: FormControl;

  ngOnInit() {
    this.control = new FormControl(this.todo.completed);

    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((completed: boolean) => {
      this.complete.emit({ ...this.todo, completed });
    });
  }

  ngOnDestroy(): void {}
}
