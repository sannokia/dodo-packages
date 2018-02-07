import React from 'react';
import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import createNodeLogger from 'redux-node-logger';
import TestUtils from 'react-addons-test-utils';

import { Provider } from 'react-redux';

import { ConnectedFormComponent } from '../../src/scripts/components/Form/Form';
import { default as formReducer, actionCreators as formActionCreators } from '../../src/scripts/lib/middlewares/form';

import Input from '../../src/scripts/components/Form/Input';

import Required from '@nemea/utils/lib/validators/common/required';
import Amount from '@nemea/utils/lib/validators/fields/amount';

import _ from 'lodash';

var mochaAsync = function(fn) {
  return async function() {
    await fn.call(this);
  };
};

import ReactDOM from 'react-dom';

var AmountValidator = Amount.extend({
  message: 'amount'
});

var debounceDelay = 5;

function delay(ms = debounceDelay) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var Form = ConnectedFormComponent;

var defaultValues = {
  'input-1': ''
};

var newValues = {
  'input-1': 'input-1'
};

suite('Form component', function() {
  var formKey = _.uniqueId('form_');
  var store;

  var renderForm = function(props, options) {

    options = _.extend({}, {
      formComponents: [
        <Input label="label-1" name="input-1"/>
      ]
    }, options);

    props = _.extend({}, {
      form: formKey,
      onSubmit() {},
      onChange() {},
      onValid() {},
      onJustValid() {},
      onInvalid() {},
      onJustInvalid() {},
      onComponentChange() {}
    }, props);

    this.onSubmit = props.onSubmit = sinon.spy(props.onSubmit);
    this.onChange = props.onChange = sinon.spy(props.onChange);
    this.onValid = props.onValid = sinon.spy(props.onValid);
    this.onJustValid = props.onJustValid = sinon.spy(props.onJustValid);
    this.onInvalid = props.onInvalid = sinon.spy(props.onInvalid);
    this.onJustInvalid = props.onJustInvalid = sinon.spy(props.onJustInvalid);
    this.onComponentChange = props.onComponentChange = sinon.spy(props.onComponentChange);

    this.formComponents = _.map(options.formComponents, (component, key) => {
      return React.cloneElement(component, { key: `field-${key}` });
    });

    this.component = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Form {...props} ref={c => this.form = c}>
          {this.formComponents}
        </Form>
      </Provider>
    );

    this.form = this.form.getWrappedInstance();
  };

  suiteSetup('Bind functions', function() {
    renderForm = renderForm.bind(this);
  });

  setup(() => {
    var newReducers = combineReducers({
      form: formReducer
    });

    const createStoreWithMiddleware = applyMiddleware(
      createNodeLogger({})
    )(createStore);

    store = createStoreWithMiddleware(newReducers);
  });

  test('Form component should have a list of attached components, matching the length of the passed form components', function() {
    renderForm();

    chai.assert.equal(Object.keys(this.form.props.components).length, this.formComponents.length);
  });

  test('Form data should contain default values', function() {

    renderForm();

    chai.assert.deepEqual(this.form.getData(), defaultValues);

  });

  suite('Prefilling and programmatic value setting', function() {
    test('Prefill data should reflect values', function() {

      renderForm({ initialValues: newValues });

      chai.assert.deepEqual(this.form.getData(), newValues);

    });

    test('Set data for form programmatically', function() {

      renderForm();

      chai.assert.deepEqual(this.form.getData(), defaultValues);

      this.form.setData(newValues);

      chai.assert.deepEqual(this.form.getData(), newValues);

    });

    test('Set data for form programmatically, preserving values for non-specified properties', function() {

      renderForm({ initialValues: newValues });

      chai.assert.deepEqual(this.form.getData(), newValues);

      var data = {
        'input-1': 'input-1-new'
      };

      this.form.setData(data, true);

      chai.assert.deepEqual(this.form.getData(), _.extend({}, newValues, data));

    });

  });

  suite('Resets', function() {
    test('Resetting a form with default values should not affect form data', function() {
      renderForm();

      var firstData = this.form.getData();

      this.form.reset();

      chai.assert.deepEqual(firstData, this.form.getData());

    });

    test('Resetting form should revert form to default values, after prefilling of data', function() {

      renderForm();

      this.form.setData(newValues);

      chai.assert.deepEqual(this.form.getData(), newValues);

      this.form.reset();

      chai.assert.deepEqual(this.form.getData(), defaultValues);

    });

    test('Resetting form should revert form to default values, after programmatic setting of data', function() {

      renderForm();

      chai.assert.deepEqual(this.form.getData(), defaultValues);

      var data = {
        'input-1': 'input-1-new'
      };

      this.form.setData(data);

      chai.assert.deepEqual(this.form.getData(), _.extend({}, defaultValues, data));

      this.form.reset();

      chai.assert.deepEqual(this.form.getData(), defaultValues);

    });

  });

  suite('Callbacks', function() {
    suite('onChange', function() {

      test('onChange is not called on fresh form', mochaAsync(async function() {
        renderForm();

        await delay(100);

        chai.assert.equal(this.onChange.callCount, 0);
      }));

      test('onChange is called on prefill data', function() {
        renderForm({
          initialValues: newValues
        });

        chai.assert.equal(this.onChange.callCount, 1);
      });

      test('onChange is called on prefill data with correct values', function() {
        renderForm({
          initialValues: newValues
        });

        chai.assert.isTrue(this.onChange.calledWith(newValues));
      });

      test('onChange is called on programmatic set data', function() {

        renderForm();

        var callCounts = {
          onChange: this.onChange.callCount
        };

        chai.assert.equal(this.onChange.callCount, callCounts.onChange + 0);

        this.form.setData(newValues);

        chai.assert.equal(this.onChange.callCount, callCounts.onChange + 1);

        this.form.setData({ 'input-1': 'input-1-new' });

        chai.assert.equal(this.onChange.callCount, callCounts.onChange + 2);

      });

      test('onChange is called on form component value change', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        var callCounts = {
          onChange: this.onChange.callCount
        };

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onChange.callCount, callCounts.onChange + 1);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onChange.callCount, callCounts.onChange + 2);

      });

      test('onChange is called on form component with new and old values', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.isTrue(this.onChange.calledWith({ 'input-1': 'test', 'input-2': ''}, { 'input-1': '', 'input-2': '' }));

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        chai.assert.isTrue(this.onChange.calledWith({ 'input-1': 'test', 'input-2': 'test2'}, { 'input-1': 'test', 'input-2': ''}));

      });
    });
    suite('onValid', function() {
      test('onValid is called once on fresh and valid form without validators', function() {
        renderForm({}, {
          formComponents: [
            <Input label="label-1" name="input-1"/>,
            <Input label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onValid.callCount, 1);
      });

      test('onValid is called on fresh and valid form with validators and defaultValues', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required]} defaultValue="input-1" label="label-1" name="input-1"/>,
            <Input validations={[Required]} defaultValue="input-2" label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onValid.callCount, 1);
      });

      test('onValid is not called on fresh and invalid form with validators and defaultValues', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required, AmountValidator]} defaultValue="input-1" label="label-1" name="input-1"/>,
            <Input validations={[Required]} defaultValue="input-2" label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onValid.callCount, 0);
      });

      test('onValid is called with form values', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required, AmountValidator]} defaultValue="3" label="label-1" name="input-1"/>,
            <Input validations={[Required]} defaultValue="input-2" label="label-2" name="input-2"/>
          ]
        });
        chai.assert.isTrue(this.onValid.calledWith({ 'input-1' : '3', 'input-2' : 'input-2' }));
      });

      test('onValid is called on form changes', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} label="label-2" name="input-2"/>
          ]
        });

        var callCounts = {
          onValid: this.onValid.callCount
        };

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onValid.callCount, ++callCounts.onValid);

        input1node.value = 'test2';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onValid.callCount, ++callCounts.onValid);

        input1node.value = 'test3';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onValid.callCount, ++callCounts.onValid);
      });

      test('onValid is not called on form changes that invalidate the form', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required, AmountValidator]} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required, AmountValidator]} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onValid.callCount, 0);

        input1node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onValid.callCount, 0);

        input1node.value = 'test3';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onValid.callCount, 0);
      });
    });

    suite('onJustValid', function() {
      test('onJustValid is called once on fresh and valid form without validators', function() {
        renderForm({}, {
          formComponents: [
            <Input label="label-1" name="input-1"/>,
            <Input label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onJustValid.callCount, 1);
      });

      test('onJustValid is called once on fresh and valid form with validators', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required]} defaultValue="input-1" label="label-1" name="input-1"/>,
            <Input validations={[Required]} defaultValue="input-2" label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onJustValid.callCount, 1);
      });

      test('onJustValid is not called on subsequent form changes if form remains valid', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required]} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustValid.callCount, 0);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input2node.value = 'test3';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input1node.value = 'test4';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustValid.callCount, 1);

      });

      test('onJustValid is called again if form validation state changes from valid -> invalid -> valid', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required]} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustValid.callCount, 0);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input2node.value = 'test3';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input1node.value = '';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input2node.value = '';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustValid.callCount, 1);

        input2node.value = 'test';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustValid.callCount, 2);

      });

      test('onJustValid is called with form values', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required, AmountValidator]} defaultValue="3" label="label-1" name="input-1"/>,
            <Input validations={[Required]} defaultValue="input-2" label="label-2" name="input-2"/>
          ]
        });
        chai.assert.isTrue(this.onValid.calledWith({ 'input-1' : '3', 'input-2' : 'input-2' }));
      });

    });

    suite('onInvalid', function() {
      test('onInvalid is not called on fresh and valid form without validators', function() {
        renderForm({}, {
          formComponents: [
            <Input label="label-1" name="input-1"/>,
            <Input label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onInvalid.callCount, 0);
      });

      test('onInvalid is called on fresh and invalid form', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required, AmountValidator]} defaultValue="42" label="label-1" name="input-1"/>,
            <Input validations={[Required]} label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onInvalid.callCount, 1);
      });

      test('onInvalid is not called on form changes that validate the form', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} defaultValue="test1-1" label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required]} defaultValue="test2-1" label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test1-2';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onInvalid.callCount, 0);

        input2node.value = 'test2-2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onInvalid.callCount, 0);

        input1node.value = 'test2-3';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onInvalid.callCount, 0);
      });

      test('onInvalid is called on form changes', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required, AmountValidator]} defaultValue="test1-1" label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required, AmountValidator]} defaultValue="test2-1" label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        chai.assert.equal(this.onInvalid.callCount, 1);

        input1node.value = 'test1-2';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onInvalid.callCount, 2);

        input2node.value = 'test2-2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onInvalid.callCount, 3);

        input1node.value = 'test2-3';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onInvalid.callCount, 4);
      });

      test('onInvalid is called with form values and error messages with reference to the errored component', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required, AmountValidator]} defaultValue="test1-1" label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required, AmountValidator]} defaultValue="test2-1" label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        chai.assert.isTrue(this.onInvalid.calledWith({ 'input-1' : 'test1-1', 'input-2' : 'test2-1' }, [
          {
            message: 'amount',
            value: 'test1-1'
          },
          {
            message: 'amount',
            value: 'test2-1'
          }
        ]));

        input1node.value = 'test1-2';
        TestUtils.Simulate.change(input1node);

        chai.assert.isTrue(this.onInvalid.calledWith({ 'input-1' : 'test1-2', 'input-2' : 'test2-1' }, [
          {
            message: 'amount',
            value: 'test1-2'
          },
          {
            message: 'amount',
            value: 'test2-1'
          }
        ]));

        input2node.value = '23';
        TestUtils.Simulate.change(input2node);

        chai.assert.isTrue(this.onInvalid.calledWith({ 'input-1' : 'test1-2', 'input-2' : '23' }, [
          {
            message: 'amount',
            value: 'test1-2'
          }
        ]));
      });

    });

    suite('onJustInvalid', function() {
      test('onJustInvalid is not called on fresh and valid form without validators', function() {
        renderForm({}, {
          formComponents: [
            <Input label="label-1" name="input-1"/>,
            <Input label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onJustInvalid.callCount, 0);
      });

      test('onJustInvalid is called once on fresh and invalid form', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required, AmountValidator]} defaultValue="42" label="label-1" name="input-1"/>,
            <Input validations={[Required]} label="label-2" name="input-2"/>
          ]
        });
        chai.assert.equal(this.onJustInvalid.callCount, 1);
      });

      test('onJustInvalid is not called on subsequent form changes if form remains invalid', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required]} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustInvalid.callCount, 1);

        input1node.value = 'test2';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustInvalid.callCount, 1);

        input2node.value = 'test3';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustInvalid.callCount, 1);

        input1node.value = 'test4';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustInvalid.callCount, 1);

      });

      test('onJustInvalid is called again if form validation state changes from invalid -> valid -> invalid', function() {

        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required]} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');


        chai.assert.equal(this.onJustInvalid.callCount, 1);

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onJustInvalid.callCount, 1);

        input2node.value = 'test2';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustInvalid.callCount, 1);

        input2node.value = '';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onJustInvalid.callCount, 2);

      });

      test('onJustInvalid is called with form values and error payload', function() {
        var input;

        renderForm({}, {
          formComponents: [
            <Input validations={[Required, AmountValidator]} defaultValue="3" label="label-1" name="input-1"/>,
            <Input ref={c => input = c} validations={[Required, AmountValidator]} defaultValue="input-2" label="label-2" name="input-2"/>
          ]
        });

        chai.assert.isTrue(this.onJustInvalid.calledWith({ 'input-1' : '3', 'input-2' : 'input-2' }, [
          {
            message: 'amount',
            value: 'input-2'
          }
        ]));
      });

    });

    suite('onComponentChange', function() {

      test('onComponentChange is called when a component triggers an onChange callback', function() {
        var input1;
        var input2;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} label="label-1" name="input-1"/>,
            <Input ref={c => input2 = c} validations={[Required]} label="label-2" name="input-2"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');
        var input2node = ReactDOM.findDOMNode(input2).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onComponentChange.callCount, 1);

        input2node.value = 'test';
        TestUtils.Simulate.change(input2node);

        chai.assert.equal(this.onComponentChange.callCount, 2);
      });

      test('onComponentChange is called with the changed component callback', function() {
        var input;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input = c} validations={[Required]} label="label-1" name="input-1"/>
          ]
        });

        var inputnode = ReactDOM.findDOMNode(input).querySelector('input');

        inputnode.value = 'test';
        TestUtils.Simulate.change(inputnode);

        chai.assert.isTrue(this.onComponentChange.calledWith({
          value: 'test',
          name: 'input-1',
          isValid: true
        }));
      });

      test('onComponentChange is called when a .doSetFieldValue action is dispatched', function() {
        var input1;

        renderForm({}, {
          formComponents: [
            <Input ref={c => input1 = c} validations={[Required]} label="label-1" name="input-1"/>
          ]
        });

        var input1node = ReactDOM.findDOMNode(input1).querySelector('input');

        input1node.value = 'test';
        TestUtils.Simulate.change(input1node);

        chai.assert.equal(this.onComponentChange.callCount, 1);

        store.dispatch(formActionCreators.doSetFieldValue(formKey, 'input-1', 'test'));

        chai.assert.equal(this.onComponentChange.callCount, 1);
      });

      test('.doSetFieldValue with a valid value should set the form\'s validity state to true', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required]} label="label-1" name="input-1"/>
          ]
        });

        chai.assert.isFalse(this.form.props.valid);

        store.dispatch(formActionCreators.doSetFieldValue(formKey, 'input-1', 'test'));

        chai.assert.isTrue(this.form.props.valid);
      });

      test('.doSetFieldValue with a valid value should set the input\'s prisine flag to false', function() {
        renderForm({}, {
          formComponents: [
            <Input validations={[Required]} label="label-1" name="input-1"/>
          ]
        });

        chai.assert.isTrue(this.form.props.components['input-1'].meta.pristine);

        store.dispatch(formActionCreators.doSetFieldValue(formKey, 'input-1', 'test'));

        chai.assert.isFalse(this.form.props.components['input-1'].meta.pristine);
      });

    });

  });

});
