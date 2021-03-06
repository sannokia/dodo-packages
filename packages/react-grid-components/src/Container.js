import React from 'react';
import bem from 'react-bem-classes';

@bem({
  block: 'container',
  modifiers: ['vertical-align']
})
class ContainerComponent extends React.Component {
  render() {
    return <div className={this.block()}>{this.props.children}</div>;
  }
}

export default ContainerComponent;
