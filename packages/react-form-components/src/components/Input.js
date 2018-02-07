import React from 'react';
import cx from 'classnames';
import autobind from 'autobind-decorator';
import FormComponent from '../FormComponent';

class InputComponent extends React.Component {
  static defaultProps = {
    type: 'text'
  };

  @autobind
  onChange(event) {
    var { onChange } = this.props;

    onChange(event.target.value);
  }

  render() {
    var {
      id,
      name,
      type,
      className,
      placeholder,
      value,
      disabled
    } = this.props;
    return (
      <input
        id={id}
        name={name}
        type={type}
        className={cx('form-control', className)}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={this.onChange}
        autoComplete="off"
      />
    );
  }
}

export default FormComponent(InputComponent);

export { InputComponent as RawInput };
