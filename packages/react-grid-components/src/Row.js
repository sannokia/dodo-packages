import React from 'react';
import bem from 'react-bem-classes';

@bem({
  block: 'row',
  modifiers: [
    'size-2',
    'size-3',
    'size-4',
    'size-5',
    'align',
    'collapse',
    'omega'
  ]
})
class RowComponent extends React.Component {
  render() {
    return <div className={this.block()}>{this.props.children}</div>;
  }
}

export default RowComponent;
