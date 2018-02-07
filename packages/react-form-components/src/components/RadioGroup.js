/* eslint jsx-a11y/label-has-for: 0 */

import React from 'react';
import cx from 'classnames';

import Radio from './Radio';
import FormComponent from '../FormComponent';

@FormComponent
class RadioGroupComponent extends React.Component {
  static defaultProps = {
    yesNo: false,
    wrap: true
  };

  static getFormComponentProps() {
    return {
      className: 'form-group--radio-checkbox',
      showIndicators: false,
      defaultValue: null
    };
  }

  getDefaultValue() {
    return this.props.defaultValue || null;
  }

  onChange(value) {
    if (value === this.props.value) {
      return;
    }

    this.props.onChange(value);
  }

  getRadios() {
    if (this.props.yesNo) {
      return [
        <Radio inline label={'Yes'} value="YES" />,
        <Radio inline label={'No'} value="NO" />
      ];
    } else {
      return this.props.children;
    }
  }

  renderRadios() {
    var radios = this.getRadios();

    return React.Children.map(radios, (child) => {
      var isChecked;

      if (this.props.yesNo) {
        isChecked =
          (child.props.value === 'YES' && this.props.value) ||
          (child.props.value === 'NO' && !this.props.value);
      } else {
        isChecked = child.props.value === this.props.value;
      }

      return React.cloneElement(child, {
        id: this.props.id + '-' + child.props.value,
        name: this.props.name,
        checked: isChecked,
        wrap: this.props.wrap,
        onChange: this.onChange.bind(
          this,
          this.props.yesNo ? child.props.value === 'YES' : child.props.value
        )
      });
    });
  }

  render() {
    var classNames = cx('radio-button-group-container', this.props.className);
    var label = this.props.labelName;

    return (
      <div className={classNames}>
        {label ? (
          <label className="radio-button-group__label">{label}</label>
        ) : null}
        {this.renderRadios.call(this)}
      </div>
    );
  }
}

RadioGroupComponent.Radio = Radio;

export default FormComponent(RadioGroupComponent);

export { RadioGroupComponent as RawRadioGroup };
