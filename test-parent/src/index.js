import React from 'react';
import _omit from 'lodash.omit';

export default class TestParent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    withRef: true
  }

  renderChild() {
    var childProps = {
      ...this.props,
      ...this.state
    };

    /* Issue: https://github.com/rackt/react-redux/issues/141
      Added option to not add ref to stateless component to remove warning "Warning: Stateless function components cannot be given refs" */

    if (this.props.withRef) {
      childProps.ref = 'child';
    }

    this._child = React.cloneElement(React.Children.only(this.props.children), _omit(childProps, 'children'));

    return this._child;
  }

  passPropsToChild(props, cb) {
    this.setState(props, cb);
  }

  getChild() {
    return this.refs.child;
  }

  render() {
    return this.renderChild();
  }
}
