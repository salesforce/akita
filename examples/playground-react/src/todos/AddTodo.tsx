import * as React from 'react';

export class AddTodo extends React.PureComponent<any> {
  render() {
    let input;
    console.log('AddTodo - render()');
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if( !input.value.trim() ) {
              return;
            }
            this.props.add(input.value);
            input.value = '';
          }}
        >
          <input ref={node => (input = node)} placeholder="Todo.."/>
          <button type="submit">Add Todo</button>
        </form>
      </div>
    );
  }
}
