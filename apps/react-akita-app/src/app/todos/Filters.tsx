import React from 'react';

export class Filters extends React.PureComponent<any> {
  render() {
    console.log('Filters - render()');

    return (
      <div>
        <span>Show: </span>
        <select onChange={this.props.onChange} value={this.props.active} className="browser-default">
          <option value="SHOW_ALL">All</option>
          <option value="SHOW_ACTIVE">Active</option>
          <option value="SHOW_COMPLETED">Completed</option>
        </select>
      </div>
    );
  }
}
