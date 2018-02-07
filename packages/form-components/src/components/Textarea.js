import React from 'react';
import cx from 'classnames';
import autobind from 'autobind-decorator';

import FormComponent from '../FormComponent';

@FormComponent
class TextareaComponent extends React.Component {
  @autobind
  onChange(event) {
    this.props.onChange(event.target.value);
  }

  static getFormComponentProps() {
    return {
      className: 'form-group--textarea'
    };
  }

  render() {
    return (
      <textarea
        className={cx('form-control', this.props.className)}
        name={this.props.name}
        onChange={this.onChange}
        value={this.props.value}
      />
    );
  }
}

export default FormComponent(TextareaComponent);

export { TextareaComponent as Textarea };
