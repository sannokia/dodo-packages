import React from 'react';
import cx from 'classnames';
import shallowEqual from 'react-pure-render/shallowEqual';
import _has from 'lodash/has';
import _includes from 'lodash/includes';
import _without from 'lodash/without';

import FormComponent from '../FormComponent';
import { RawCheckbox as Checkbox } from './Checkbox';

class CheckboxGroupComponent extends React.Component {
  static defaultProps = {
    yesNo: false,
    wrap: true
  };

  static getFormComponentProps() {
    return {
      className: 'form-group--radio-checkbox',
      showIndicators: false,
      defaultValue: []
    };
  }

  getDefaultValue() {
    return this.props.defaultValue || [];
  }

  componentWillReceiveProps(nextProps) {
    if (
      _has(nextProps, 'value') &&
      !shallowEqual(this.state.value, nextProps.value)
    ) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || this.props.defaultValue || []
    };
  }

  onChange(name, isChecked) {
    var values = this.state.value.slice() || [];

    if (_includes(values, name)) {
      if (!isChecked) {
        values = _without(values, name);
      }
    } else {
      if (isChecked) {
        values.push(name);
      }
    }

    this.setState({
      value: values
    });

    this.props.onChange(values);
  }

  renderCheckboxes() {
    return React.Children.map(this.props.children, (child) => {
      var isChecked = _includes(this.state.value, child.props.value);

      return React.cloneElement(child, {
        id: this.props.id + '-' + child.props.value,
        name: this.props.name,
        value: isChecked,
        wrapAround: false,
        inline: true,
        isPartOfForm: false,
        silent: true,
        onChange: this.onChange.bind(this, child.props.value)
      });
    });
  }

  render() {
    var classNames = cx('radio-button-group-container', this.props.className);

    return <div className={classNames}>{this.renderCheckboxes.call(this)}</div>;
  }
}

CheckboxGroupComponent.Checkbox = Checkbox;

export default FormComponent(CheckboxGroupComponent);

export { CheckboxGroupComponent as RawCheckboxGroup };
