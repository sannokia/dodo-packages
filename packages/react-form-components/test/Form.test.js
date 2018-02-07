/*  eslint react/jsx-no-bind: 0 */
/*  eslint no-unused-vars: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import createNodeLogger from 'redux-node-logger';
import { Provider } from 'react-redux';

import { ConnectedFormComponent } from '../src/Form';
import {
  default as formReducer,
  actionCreators as formActionCreators
} from '../src/middleware';
import Input from '../src/components/Input';
import Required from '@dodo/utils/lib/validators/common/required';
import Email from '@dodo/utils/lib/validators/common/email';

import _ from 'lodash';

var formKey = _.uniqueId('form_');

var EmailValidator = Email.extend({
  message: 'email'
});

var debounceDelay = 5;

const delay = (ms = debounceDelay) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

var defaultValues = {
  'input-1': ''
};

var newValues = {
  'input-1': 'input-1'
};

var Form = ConnectedFormComponent;
var context = {};
var store = {};

var renderForm = (context, props, options) => {
  options = Object.assign(
    {},
    {
      formComponents: [<Input label="label-1" name="input-1" />]
    },
    options
  );

  props = Object.assign(
    {},
    {
      form: formKey,
      onSubmit() {},
      onChange() {},
      onValid() {},
      onJustValid() {},
      onInvalid() {},
      onJustInvalid() {},
      onComponentChange() {}
    },
    props
  );

  context.onSubmit = props.onSubmit = jest.fn(props.onSubmit);
  context.onChange = props.onChange = jest.fn(props.onChange);
  context.onValid = props.onValid = jest.fn(props.onValid);
  context.onJustValid = props.onJustValid = jest.fn(props.onJustValid);
  context.onInvalid = props.onInvalid = jest.fn(props.onInvalid);
  context.onJustInvalid = props.onJustInvalid = jest.fn(props.onJustInvalid);
  context.onComponentChange = props.onComponentChange = jest.fn(
    props.onComponentChange
  );

  context.formComponents = _.map(options.formComponents, (component, key) => {
    return React.cloneElement(component, { key: `field-${key}` });
  });

  context.component = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <Form {...props} ref={(c) => (context.form = c)}>
        {context.formComponents}
      </Form>
    </Provider>
  );

  context.form = context.form.getWrappedInstance();
};

describe('Form component', () => {
  renderForm = renderForm.bind(null, context);

  beforeEach(() => {
    var newReducers = combineReducers({
      form: formReducer
    });

    const createStoreWithMiddleware = applyMiddleware(createNodeLogger({}))(
      createStore
    );

    store = createStoreWithMiddleware(newReducers);
  });

  test('Form component should have a list of attached components, matching the length of the passed form components', () => {
    renderForm();

    expect(Object.keys(context.form.props.components).length).toEqual(
      context.formComponents.length
    );
  });

  test('Form data should contain default values', () => {
    renderForm();

    expect(context.form.getData()).toEqual(defaultValues);
  });

  describe('Prefilling and programmatic value setting', () => {
    test('Prefill data should reflect values', () => {
      renderForm({ initialValues: newValues });

      expect(context.form.getData()).toEqual(newValues);
    });

    test('Set data for form programmatically', () => {
      renderForm();

      expect(context.form.getData()).toEqual(defaultValues);

      context.form.setData(newValues);

      expect(context.form.getData()).toEqual(newValues);
    });

    test('Set data for form programmatically, preserving values for non-specified properties', () => {
      renderForm({ initialValues: newValues });

      expect(context.form.getData()).toEqual(newValues);

      var data = {
        'input-1': 'input-1-new'
      };

      context.form.setData(data, true);

      expect(context.form.getData()).toEqual(_.extend({}, newValues, data));
    });
  });

  describe('Resets', () => {
    test('Resetting a form with default values should not affect form data', () => {
      renderForm();

      var firstData = context.form.getData();

      context.form.reset();

      expect(firstData).toEqual(context.form.getData());
    });

    test('Resetting form should revert form to default values, after prefilling of data', () => {
      renderForm();

      context.form.setData(newValues);

      expect(context.form.getData()).toEqual(newValues);

      context.form.reset();

      expect(context.form.getData()).toEqual(defaultValues);
    });

    test('Resetting form should revert form to default values, after programmatic setting of data', () => {
      renderForm();

      expect(context.form.getData()).toEqual(defaultValues);

      var data = {
        'input-1': 'input-1-new'
      };

      context.form.setData(data);

      expect(context.form.getData()).toEqual(_.extend({}, defaultValues, data));

      context.form.reset();

      expect(context.form.getData()).toEqual(defaultValues);
    });
  });

  describe('Callbacks', () => {
    describe('onChange', () => {
      test('onChange is not called on fresh form', async () => {
        renderForm();

        await delay(100);

        expect(context.onChange).toHaveBeenCalledTimes(0);
      });

      test('onChange is called on prefill data', () => {
        renderForm({
          initialValues: newValues
        });

        expect(context.onChange).toHaveBeenCalledTimes(1);
      });

      test('onChange is called on prefill data with correct values', () => {
        renderForm({
          initialValues: newValues
        });

        expect(context.onChange).toHaveBeenCalledWith(newValues, null);
      });

      test('onChange is called on programmatic set data', () => {
        renderForm();

        var callCounts = {
          onChange: context.onChange.mock.calls.length
        };

        expect(context.onChange).toHaveBeenCalledTimes(callCounts.onChange + 0);

        context.form.setData(newValues);

        expect(context.onChange).toHaveBeenCalledTimes(callCounts.onChange + 1);

        context.form.setData({ 'input-1': 'input-1-new' });

        expect(context.onChange).toHaveBeenCalledTimes(callCounts.onChange + 2);
      });

      test('onChange is called on form component value change', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                label="label-1"
                name="input-1"
              />,
              <Input ref={(c) => (input2 = c)} label="label-2" name="input-2" />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        var callCounts = {
          onChange: context.onChange.mock.calls.length
        };

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onChange).toHaveBeenCalledTimes(callCounts.onChange + 1);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        expect(context.onChange).toHaveBeenCalledTimes(callCounts.onChange + 2);
      });

      test('onChange is called on form component with new and old values', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                label="label-1"
                name="input-1"
              />,
              <Input ref={(c) => (input2 = c)} label="label-2" name="input-2" />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onChange).toHaveBeenCalledWith(
          { 'input-1': 'test', 'input-2': '' },
          { 'input-1': '', 'input-2': '' }
        );

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        expect(context.onChange).toHaveBeenCalledWith(
          { 'input-1': 'test', 'input-2': 'test2' },
          { 'input-1': 'test', 'input-2': '' }
        );
      });
    });

    describe('onValid', () => {
      test('onValid is called once on fresh and valid form without validators', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input label="label-1" name="input-1" />,
              <Input label="label-2" name="input-2" />
            ]
          }
        );
        expect(context.onValid).toHaveBeenCalledTimes(1);
      });

      test('onValid is called on fresh and valid form with validators and defaultValues', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required]}
                defaultValue="input-1"
                label="label-1"
                name="input-1"
              />,
              <Input
                validations={[Required]}
                defaultValue="input-2"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );
        expect(context.onValid).toHaveBeenCalledTimes(1);
      });

      test('onValid is not called on fresh and invalid form with validators and defaultValues', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required, EmailValidator]}
                defaultValue="input-1"
                label="label-1"
                name="input-1"
              />,
              <Input
                validations={[Required]}
                defaultValue="input-2"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );
        expect(context.onValid).toHaveBeenCalledTimes(0);
      });

      test('onValid is called with form values', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required, EmailValidator]}
                defaultValue="adrian.bonnici@isobar.com"
                label="label-1"
                name="input-1"
              />,
              <Input
                validations={[Required]}
                defaultValue="input-2"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );
        expect(context.onValid).toHaveBeenCalledWith({
          'input-1': 'adrian.bonnici@isobar.com',
          'input-2': 'input-2'
        });
      });

      test('onValid is called on form changes', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                label="label-1"
                name="input-1"
              />,
              <Input ref={(c) => (input2 = c)} label="label-2" name="input-2" />
            ]
          }
        );

        var callCounts = {
          onValid: context.onValid.mock.calls.length
        };

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onValid).toHaveBeenCalledTimes(++callCounts.onValid);

        input1node.value = 'test2';
        TestUtils.Simulate.change(input1node);

        expect(context.onValid).toHaveBeenCalledTimes(++callCounts.onValid);

        input1node.value = 'test3';
        TestUtils.Simulate.change(input1node);

        expect(context.onValid).toHaveBeenCalledTimes(++callCounts.onValid);
      });

      test('onValid is not called on form changes that invalidate the form', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required, EmailValidator]}
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required, EmailValidator]}
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onValid).toHaveBeenCalledTimes(0);

        input1node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        expect(context.onValid).toHaveBeenCalledTimes(0);

        input1node.value = 'test3';
        TestUtils.Simulate.change(input1node);

        expect(context.onValid).toHaveBeenCalledTimes(0);
      });
    });

    describe('onJustValid', () => {
      test('onJustValid is called once on fresh and valid form without validators', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input label="label-1" name="input-1" />,
              <Input label="label-2" name="input-2" />
            ]
          }
        );
        expect(context.onJustValid).toHaveBeenCalledTimes(1);
      });

      test('onJustValid is called once on fresh and valid form with validators', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required]}
                defaultValue="input-1"
                label="label-1"
                name="input-1"
              />,
              <Input
                validations={[Required]}
                defaultValue="input-2"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );
        expect(context.onJustValid).toHaveBeenCalledTimes(1);
      });

      test('onJustValid is not called on subsequent form changes if form remains valid', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required]}
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustValid).toHaveBeenCalledTimes(0);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input2node.value = 'test3';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input1node.value = 'test4';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);
      });

      test('onJustValid is called again if form validation state changes from valid -> invalid -> valid', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required]}
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustValid).toHaveBeenCalledTimes(0);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input2node.value = 'test3';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input1node.value = '';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input2node.value = '';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustValid).toHaveBeenCalledTimes(1);

        input2node.value = 'test';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustValid).toHaveBeenCalledTimes(2);
      });

      test('onJustValid is called with form values', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required, EmailValidator]}
                defaultValue="adrian.bonnici@isobar.com"
                label="label-1"
                name="input-1"
              />,
              <Input
                validations={[Required]}
                defaultValue="input-2"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );
        expect(context.onValid).toHaveBeenCalledWith({
          'input-1': 'adrian.bonnici@isobar.com',
          'input-2': 'input-2'
        });
      });
    });

    describe('onInvalid', () => {
      test('onInvalid is not called on fresh and valid form without validators', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input label="label-1" name="input-1" />,
              <Input label="label-2" name="input-2" />
            ]
          }
        );
        expect(context.onInvalid).toHaveBeenCalledTimes(0);
      });

      test('onInvalid is called on fresh and invalid form', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required, EmailValidator]}
                defaultValue="42"
                label="label-1"
                name="input-1"
              />,
              <Input validations={[Required]} label="label-2" name="input-2" />
            ]
          }
        );
        expect(context.onInvalid).toHaveBeenCalledTimes(1);
      });

      test('onInvalid is not called on form changes that validate the form', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                defaultValue="test1-1"
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required]}
                defaultValue="test2-1"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test1-2';
        TestUtils.Simulate.change(input1node);

        expect(context.onInvalid).toHaveBeenCalledTimes(0);

        input2node.value = 'test2-2';
        TestUtils.Simulate.change(input2node);

        expect(context.onInvalid).toHaveBeenCalledTimes(0);

        input1node.value = 'test2-3';
        TestUtils.Simulate.change(input1node);

        expect(context.onInvalid).toHaveBeenCalledTimes(0);
      });

      test('onInvalid is called on form changes', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required, EmailValidator]}
                defaultValue="test1-1"
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required, EmailValidator]}
                defaultValue="test2-1"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        expect(context.onInvalid).toHaveBeenCalledTimes(1);

        input1node.value = 'test1-2';
        TestUtils.Simulate.change(input1node);

        expect(context.onInvalid).toHaveBeenCalledTimes(2);

        input2node.value = 'test2-2';
        TestUtils.Simulate.change(input2node);

        expect(context.onInvalid).toHaveBeenCalledTimes(3);

        input1node.value = 'test2-3';
        TestUtils.Simulate.change(input1node);

        expect(context.onInvalid).toHaveBeenCalledTimes(4);
      });

      test('onInvalid is called with form values and error messages with reference to the errored component', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required, EmailValidator]}
                defaultValue="test1-1"
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required, EmailValidator]}
                defaultValue="test2-1"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        expect(context.onInvalid).toHaveBeenCalledWith(
          { 'input-1': 'test1-1', 'input-2': 'test2-1' },
          [
            {
              message: 'email',
              value: 'test1-1'
            },
            {
              message: 'email',
              value: 'test2-1'
            }
          ]
        );

        input1node.value = 'test1-2';
        TestUtils.Simulate.change(input1node);

        expect(context.onInvalid).toHaveBeenCalledWith(
          { 'input-1': 'test1-2', 'input-2': 'test2-1' },
          [
            {
              message: 'email',
              value: 'test1-2'
            },
            {
              message: 'email',
              value: 'test2-1'
            }
          ]
        );

        input2node.value = 'adrian.bonnici@isobar.com';
        TestUtils.Simulate.change(input2node);

        expect(context.onInvalid).toHaveBeenCalledWith(
          { 'input-1': 'test1-2', 'input-2': 'adrian.bonnici@isobar.com' },
          [
            {
              message: 'email',
              value: 'test1-2'
            }
          ]
        );
      });
    });

    describe('onJustInvalid', () => {
      test('onJustInvalid is not called on fresh and valid form without validators', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input label="label-1" name="input-1" />,
              <Input label="label-2" name="input-2" />
            ]
          }
        );
        expect(context.onJustInvalid).toHaveBeenCalledTimes(0);
      });

      test('onJustInvalid is called once on fresh and invalid form', () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required, EmailValidator]}
                defaultValue="42"
                label="label-1"
                name="input-1"
              />,
              <Input validations={[Required]} label="label-2" name="input-2" />
            ]
          }
        );
        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);
      });

      test('onJustInvalid is not called on subsequent form changes if form remains invalid', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required]}
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);

        input1node.value = 'test2';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);

        input2node.value = 'test3';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);

        input1node.value = 'test4';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);
      });

      test('onJustInvalid is called again if form validation state changes from invalid -> valid -> invalid', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required]}
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(1);

        input2node.value = '';
        TestUtils.Simulate.change(input2node);

        expect(context.onJustInvalid).toHaveBeenCalledTimes(2);
      });

      test('onJustInvalid is called with form values and error payload', () => {
        var input;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                validations={[Required, EmailValidator]}
                defaultValue="adrian.bonnici@isobar.com"
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input = c)}
                validations={[Required, EmailValidator]}
                defaultValue="input-2"
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        expect(context.onJustInvalid).toHaveBeenCalledWith(
          { 'input-1': 'adrian.bonnici@isobar.com', 'input-2': 'input-2' },
          [
            {
              message: 'email',
              value: 'input-2'
            }
          ]
        );
      });
    });

    describe('onComponentChange', () => {
      test('onComponentChange is called when a component triggers an onChange callback', () => {
        var input1;
        var input2;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />,
              <Input
                ref={(c) => (input2 = c)}
                validations={[Required]}
                label="label-2"
                name="input-2"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onComponentChange.mock.calls.length).toEqual(1);

        input2node.value = 'test';
        TestUtils.Simulate.change(input2node);

        expect(context.onComponentChange.mock.calls.length).toEqual(2);
      });

      test('onComponentChange is called with the changed component callback', () => {
        var input;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />
            ]
          }
        );

        var inputnode = ReactDOM.findDOMNode(input).querySelector('input');

        inputnode.value = 'test';
        TestUtils.Simulate.change(inputnode);

        expect(context.onComponentChange).toHaveBeenCalledWith({
          value: 'test',
          name: 'input-1',
          isValid: true
        });
      });

      test('onComponentChange is called when a .doSetFieldValue action is dispatched', () => {
        var input1;

        renderForm(
          {},
          {
            formComponents: [
              <Input
                ref={(c) => (input1 = c)}
                validations={[Required]}
                label="label-1"
                name="input-1"
              />
            ]
          }
        );

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        expect(context.onComponentChange).toHaveBeenCalledTimes(1);

        store.dispatch(
          formActionCreators.doSetFieldValue(formKey, 'input-1', 'test')
        );

        expect(context.onComponentChange).toHaveBeenCalledTimes(1);
      });

      test(".doSetFieldValue with a valid value should set the form's validity state to true", () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input validations={[Required]} label="label-1" name="input-1" />
            ]
          }
        );

        expect(context.form.props.valid).toBeFalsy();

        store.dispatch(
          formActionCreators.doSetFieldValue(formKey, 'input-1', 'test')
        );

        expect(context.form.props.valid).toBeTruthy();
      });

      test(".doSetFieldValue with a valid value should set the input's prisine flag to false", () => {
        renderForm(
          {},
          {
            formComponents: [
              <Input validations={[Required]} label="label-1" name="input-1" />
            ]
          }
        );

        expect(
          context.form.props.components['input-1'].meta.pristine
        ).toBeTruthy();

        store.dispatch(
          formActionCreators.doSetFieldValue(formKey, 'input-1', 'test')
        );

        expect(
          context.form.props.components['input-1'].meta.pristine
        ).toBeFalsy();
      });
    });
  });
});
