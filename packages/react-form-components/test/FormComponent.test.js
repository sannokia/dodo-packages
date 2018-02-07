/* eslint react/jsx-no-bind: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import _ from 'lodash';
import TestParent from '@dodo/react-test-parent';
import TestUtils from 'react-dom/test-utils';
import FormComponent from '../src/FormComponent';
import Required from '@dodo/utils/lib/validators/common/required';
import Email from '@dodo/utils/lib/validators/common/email';

var EmailValidator = Email.extend({
  message: 'Should be a valid email address.'
});

var context = {};

var updateValue = (context, value) => {
  context.node.value = value;
  TestUtils.Simulate.change(context.node);
};

var renderInput = (context, props) => {
  props = _.extend(
    {},
    {
      name: 'input-1',
      label: 'Input 1',
      onChange() {},
      onValid() {},
      onInvalid() {}
    },
    props || {}
  );

  context.onChange = props.onChange = jest.fn(props.onChange);
  context.onValid = props.onValid = jest.fn(props.onValid);
  context.onInvalid = props.onInvalid = jest.fn(props.onInvalid);

  var renderedComponent = (context.component = TestUtils.renderIntoDocument(
    <TestParent>
      <Input {...props} />
    </TestParent>
  ));

  context.node = TestUtils.findRenderedDOMComponentWithTag(
    renderedComponent,
    'input'
  );

  context.input = ReactDOM.findDOMNode(context.component);
};

var getInput = (context) => {
  return context.component.getChild();
};

@FormComponent
class Input extends React.Component {
  onChange(event) {
    this.props.onChange(event.target.value);
  }

  getValue() {
    return this.props.value;
  }

  render() {
    return (
      <input
        id={this.props.id}
        className={cx('form-control', this.props.className)}
        placeholder={this.props.placeholder}
        name={this.props.name}
        onChange={this.onChange.bind(this)}
        value={this.getValue()}
      />
    );
  }
}

describe('FormComponent component', function() {
  renderInput = renderInput.bind(null, context);
  updateValue = updateValue.bind(null, context);
  getInput = getInput.bind(null, context);

  test('Input markup should be valid', function() {
    renderInput();
    expect(context.node.classList.contains('form-control')).toBeTruthy();
  });

  test('Input should have an id', function() {
    renderInput();
    expect(context.node.getAttribute('id'));
  });

  test('onChange should not be called on first render with default component value', function() {
    renderInput();
    expect(context.onChange.mock.calls.length).toEqual(0);
  });

  test('onChange should be called on first render with default value (not default component value)', function() {
    renderInput({
      defaultValue: 'defaultValue'
    });
    expect(context.onChange.mock.calls.length).toEqual(1);
  });

  test('onValid should be called on first render with default component value', function() {
    renderInput();
    expect(context.onValid.mock.calls.length).toEqual(1);
  });

  test('onValid should be called on first render with default value (not default component value)', function() {
    renderInput({
      defaultValue: 'defaultValue'
    });
    expect(context.onValid.mock.calls.length).toEqual(1);
  });

  test('Input should accept additional class names', function() {
    renderInput({ className: 'test-class' });
    expect(context.node.classList.contains('form-control')).toBeTruthy();
    expect(context.node.classList.contains('test-class')).toBeTruthy();
  });

  test('Changing input values should trigger onChange and onValid', function() {
    renderInput({
      onChange: () => {}
    });

    var callCounts = {
      onChange: context.onChange.mock.calls.length,
      onValid: context.onValid.mock.calls.length,
      onInvalid: context.onInvalid.mock.calls.length
    };

    updateValue('test');

    expect(context.onChange).toHaveBeenCalledWith('test');
    expect(context.onChange.mock.calls.length).toEqual(callCounts.onChange + 1);
    expect(context.onValid).toHaveBeenCalledWith('test');
    expect(context.onValid.mock.calls.length).toEqual(callCounts.onValid + 1);

    updateValue('test2');

    expect(context.onChange).toHaveBeenCalledWith('test2');
    expect(context.onChange.mock.calls.length).toEqual(callCounts.onChange + 2);
    expect(context.onValid).toHaveBeenCalledWith('test2');
    expect(context.onValid.mock.calls.length).toEqual(callCounts.onValid + 2);

    updateValue('test23');

    expect(context.onChange).toHaveBeenCalledWith('test23');
    expect(context.onChange.mock.calls.length).toEqual(callCounts.onChange + 3);
    expect(context.onValid).toHaveBeenCalledWith('test23');
    expect(context.onValid.mock.calls.length).toEqual(callCounts.onValid + 3);

    // onInvalid should never be invoked
    expect(context.onInvalid.mock.calls.length).toEqual(0);
  });

  test('Component isValid() should reflect value changes', function() {
    renderInput({
      validations: [Required]
    });

    expect(getInput().isValid()).toBeFalsy();

    updateValue('test');

    expect(getInput().isValid()).toBeTruthy();

    updateValue('');

    expect(getInput().isValid()).toBeFalsy();
  });

  test('Invoke onChange events', function() {
    renderInput();

    updateValue('test');

    expect(context.onChange).toHaveBeenCalledWith('test');
    expect(context.onChange).toHaveBeenCalledTimes(1);

    updateValue('test2');

    expect(context.onChange).toHaveBeenCalledWith('test2');
    expect(context.onChange.mock.calls.length).toEqual(2);
  });

  test('Inputting invalid amounts should trigger the onInvalid callback', function() {
    renderInput({
      validations: [Required, EmailValidator]
    });

    updateValue('');

    expect(context.onInvalid.mock.calls.length).toEqual(1);
    expect(context.onValid.mock.calls.length).toEqual(0);

    updateValue('adrian.bonnici@isobar.com');

    expect(context.onInvalid.mock.calls.length).toEqual(1);
    expect(context.onValid.mock.calls.length).toEqual(1);

    updateValue('adrian.bonnici@isobar.com');

    expect(context.onInvalid.mock.calls.length).toEqual(1);
    expect(context.onValid.mock.calls.length).toEqual(1);

    updateValue('2331jdaj23');

    expect(context.onInvalid.mock.calls.length).toEqual(2);
    expect(context.onValid.mock.calls.length).toEqual(1);
  });

  test('Inputting invalid amounts should reflect validation state', function() {
    renderInput({
      validations: [Required, EmailValidator]
    });

    updateValue('');

    expect(getInput().isValid()).toBeFalsy();

    updateValue('adrian.bonnici@isobar.com');

    expect(getInput().isValid()).toBeTruthy();

    updateValue('2331jdaj23');

    expect(getInput().isValid()).toBeFalsy();

    expect(getInput().getErrorMessage()).toEqual(
      'Should be a valid email address.'
    );
  });

  describe('Default values', function() {
    var defaultValue = 'defaultVALUE';

    var renderDefaultValueInput = function(props) {
      renderInput(_.extend({}, { defaultValue }, props));
    };

    test('Input should respect defaultValue', function() {
      renderDefaultValueInput();

      expect(getInput().getValue()).toEqual(defaultValue);
      expect(getInput().isValid()).toBeTruthy();
    });

    test('Input with a valid defaultValue triggers initial onChange and onValid callbacks', function() {
      expect(context.onChange.mock.calls.length).toEqual(1);
      expect(context.onInvalid.mock.calls.length).toEqual(0);
      expect(context.onValid.mock.calls.length).toEqual(1);
    });

    test('Input with an invalid defaultValue triggers initial onChange and onInvalid callbacks', function() {
      renderDefaultValueInput({
        validations: [Required, EmailValidator]
      });

      expect(context.onChange.mock.calls.length).toEqual(1);
      expect(context.onInvalid.mock.calls.length).toEqual(1);
      expect(context.onValid.mock.calls.length).toEqual(0);
    });

    test('Value of input with defaultValue can be changed', function() {
      updateValue('asdfasd');
      expect(getInput().getValue()).toEqual('asdfasd');
    });
  });

  test('Component can be controlled', function() {
    renderInput({
      value: 'test'
    });

    expect(getInput().getValue()).toEqual('test');

    // Ensure onChange has not been called on first mount
    expect(context.onChange.mock.calls.length).toEqual(1);

    context.component.passPropsToChild({
      value: 'test2'
    });

    expect(getInput().getValue()).toEqual('test2');

    // Ensure onChange has been called after value change
    expect(context.onChange.mock.calls.length).toEqual(2);

    context.component.passPropsToChild({
      value: 'test3'
    });

    expect(getInput().getValue()).toEqual('test3');

    // Ensure onChange has been called after value change
    expect(context.onChange.mock.calls.length).toEqual(3);
  });
});
