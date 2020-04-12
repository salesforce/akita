import React from 'react';

export class Todo extends React.PureComponent<any> {
  toggleTodo = () => this.props.toggleTodo(this.props.id);
  onDelete = () => this.props.onDelete(this.props.id);

  render() {
    console.log(`Todo ${this.props.id} - render() `);
    return (
      <li
        style={{
          textDecoration: this.props.completed ? 'line-through' : 'none'
        }}
      >
        <span
          onClick={this.toggleTodo}
          style={{
            marginRight: '10px'
          }}
        >
          {this.props.text}
        </span>
        <button onClick={this.onDelete}>Delete</button>
      </li>
    );
  }
}

export class TodoList extends React.PureComponent<any> {
  toggleTodo = id => this.props.toggleTodo(id);
  onDelete = id => this.props.onDelete(id);

  render() {
    console.log('TodoList - render()');
    return (
      <ul>
        {this.props.todos.map(todo => (
          <Todo key={todo.id} {...todo} toggleTodo={this.toggleTodo} onDelete={this.onDelete} />
        ))}
      </ul>
    );
  }
}
