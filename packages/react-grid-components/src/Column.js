import React from 'react';
import bem from 'react-bem-classes';

@bem({
  block: 'col',
  modifiers: ['omega']
})
class ColumnComponent extends React.Component {
  render() {
    return <div className={this.block()}>{this.props.children}</div>;
  }
}

export default ColumnComponent;
