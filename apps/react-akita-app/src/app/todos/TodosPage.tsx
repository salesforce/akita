import React from 'react';
import { AddTodo } from './AddTodo';
import { Filters } from './Filters';
import { TodoList } from './Todos';
import { untilDestroyed } from '../take-until';
import { todosService } from './state/todos.service';
import { todosQuery } from './state/todos.query';
import { Todo } from './state/todo.model';
import { ID } from '@datorama/akita';

export class TodosPageComponent extends React.PureComponent {
  state: { todos: Todo[]; filter: string } = { todos: [], filter: '' };

  constructor(props) {
    super(props);
  }

  add = (text: string) => todosService.add(text);

  toggleTodo = (id: ID) => todosService.complete(id);

  deleteTodo = (id: ID) => todosService.delete(id);

  changeFilter = ({ target: { value } }) => {
    todosService.updateFilter(value);
  };

  componentDidMount() {
    todosQuery.selectVisibleTodos$.pipe(untilDestroyed(this)).subscribe(todos => this.setState({ todos }));

    todosQuery.selectVisibilityFilter$.pipe(untilDestroyed(this)).subscribe(filter => this.setState({ filter }));
  }

  render() {
    return (
      <div className="padding">
        <AddTodo add={this.add} />
        <TodoList todos={this.state.todos} toggleTodo={this.toggleTodo} onDelete={this.deleteTodo} />
        <Filters onChange={this.changeFilter} active={this.state.filter} />
      </div>
    );
  }
}
