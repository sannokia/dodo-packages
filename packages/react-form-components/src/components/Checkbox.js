/*  eslint jsx-a11y/label-has-for: 0 */

import React from 'react';
import cx from 'classnames';
import autobind from 'autobind-decorator';
import FormComponent from '../FormComponent';

class Checkbox extends React.Component {
  static getFormComponentProps() {
    return {
      className: 'form-group--radio-checkbox',
      showIndicators: false,
      defaultValue: false
    };
  }

  getDefaultValue() {
    return this.props.defaultChecked || false;
  }

  @autobind
  onChange() {
    this.props.onChange(!this.props.value);
  }

  render() {
    var classNames = cx(
      'checkbox-wrapper',
      'checkbox-button-group-container',
      {
        'checkbox-wrapper--inline': this.props.inline
      },
      this.props.className
    );

    var labelProps = {};

    var label = this.props.checkboxLabel || this.props.label;

    var isLabelString = typeof label === 'string';

    if (isLabelString) {
      labelProps.dangerouslySetInnerHTML = {
        __html: label
      };
    }

    return (
      <div className={classNames}>
        <input
          type="checkbox"
          id={this.props.id}
          name={this.props.name}
          className="form-control"
          onChange={this.onChange}
          checked={this.props.value}
          disabled={this.props.disabled}
        />

        {label ? (
          <label htmlFor={this.props.id} {...labelProps}>
            {isLabelString ? null : label}
          </label>
        ) : null}
      </div>
    );
  }
}

export default FormComponent(Checkbox);

export { Checkbox as RawCheckbox };
