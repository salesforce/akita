import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../state/todo.model';
import { ID } from '@datorama/akita';

@Component({
  selector: 'app-todos',
  template: `
    <div class="collection with-header">
      <h4 class="collection-header">Todos:</h4>
      <app-todo *ngFor="let todo of todos;"
                class="collection-item"
                (delete)="delete.emit($event)"
                (complete)="complete.emit($event)"
                [todo]="todo"></app-todo>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent {
  @Input()
  todos: Todo[];
  @Output()
  complete = new EventEmitter<Todo>();
  @Output()
  delete = new EventEmitter<ID>();
}
