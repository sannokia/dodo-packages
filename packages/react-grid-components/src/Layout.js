import React from 'react';
import bem from 'react-bem-classes';

@bem({
  block: 'layout'
})
class LayoutComponent extends React.Component {
  render() {
    return (
      <div className={this.block()}>
        <div className={this.element('content')}>{this.props.children}</div>
      </div>
    );
  }
}

export default LayoutComponent;
