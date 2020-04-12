import { Component, OnInit } from '@angular/core';
import { initialFilters, VISIBILITY_FILTER } from '../filter/filter.model';
import { Todo } from '../state/todo.model';
import { TodosQuery } from '../state/todos.query';
import { TodosService } from '../state/todos.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ID, isUndefined, StateHistoryPlugin, EntityStateHistoryPlugin } from '@datorama/akita';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.css']
})
export class TodosPageComponent implements OnInit {
  todos$: Observable<Todo[]>;
  activeFilter$: Observable<VISIBILITY_FILTER>;

  filters = initialFilters;
  checkAll$: Observable<boolean>;
  stateHistory: StateHistoryPlugin;
  stateHistoryEntity: EntityStateHistoryPlugin;

  constructor(private todosQuery: TodosQuery, private todosService: TodosService) {}

  ngOnInit() {
    this.todos$ = this.todosQuery.selectVisibleTodos$;
    this.activeFilter$ = this.todosQuery.selectVisibilityFilter$;
    this.checkAll$ = this.todosQuery.checkAll$.pipe(map(numCompleted => numCompleted && numCompleted === this.todosQuery.getCount()));
    this.stateHistory = new StateHistoryPlugin(this.todosQuery);
    this.stateHistoryEntity = new EntityStateHistoryPlugin(this.todosQuery);
  }

  moveUp(index: number) {
    this.todosService.move(index);
  }

  undo(id?) {
    if (isUndefined(id)) {
      this.stateHistory.undo();
    } else {
      this.stateHistoryEntity.undo(id);
    }
  }

  redo(id?) {
    if (isUndefined(id)) {
      this.stateHistory.redo();
    } else {
      this.stateHistoryEntity.redo(id);
    }
  }

  add(input: HTMLInputElement) {
    this.todosService.add(input.value);
    input.value = '';
  }

  complete(todo: Todo) {
    this.stateHistory.ignoreNext();
    this.todosService.complete(todo);
  }

  complete2(event, todo: Todo) {
    const _todo = { ...todo, completed: event.target.checked };
    this.todosService.complete(_todo);
  }

  delete(id: ID) {
    this.todosService.delete(id);
  }

  changeFilter(filter: VISIBILITY_FILTER) {
    this.todosService.updateFilter(filter);
  }

  checkAll({ target }) {
    this.todosService.checkAll(target.checked);
  }

  trackBy(_, todo) {
    return todo.id;
  }
}
