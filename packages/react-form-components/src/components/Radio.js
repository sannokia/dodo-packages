/*  eslint jsx-a11y/label-has-for: 0 */

import React from 'react';
import cx from 'classnames';
import autobind from 'autobind-decorator';

class RadioComponent extends React.Component {
  static defaultProps = {
    onChange: () => {},
    inline: false
  };

  @autobind
  toggle() {
    this.props.onChange(this.props.value, this);
  }

  render() {
    var classNames = cx(
      'radio-button-wrapper',
      {
        'radio-button-wrapper--inline': this.props.inline
      },
      this.props.className
    );

    var labelProps = {};

    var isLabelString = typeof this.props.label === 'string';

    if (isLabelString) {
      labelProps.dangerouslySetInnerHTML = {
        __html: this.props.label
      };
    }

    return (
      <div className={classNames}>
        <input
          ref="input"
          type="radio"
          id={this.props.id}
          name={this.props.name}
          className="form-control"
          onChange={this.toggle}
          value={this.props.value}
          checked={this.props.checked}
          disabled={this.props.disabled}
        />

        <label htmlFor={this.props.id} {...labelProps}>
          {isLabelString ? null : this.props.label}
        </label>
      </div>
    );
  }
}

export default RadioComponent;
