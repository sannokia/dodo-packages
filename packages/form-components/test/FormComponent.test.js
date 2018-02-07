var FormComponent = require('../../src/scripts/lib/decorators/FormComponent');
var Required = require('@nemea/utils/lib/validators/common/required.js');
var Amount = require('@nemea/utils/lib/validators/fields/amount.js');
var cx = require('classnames');
var TestParent = require('@nemea/test-parent');

var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var _ = require('lodash');

Amount = Amount.extend({ message: 'Amount should be a numeric value greater than 0.'});

@FormComponent
class Input extends React.Component {

  onChange(event) {
    this.props.onChange(event.target.value);
  }

  getValue() {
    return this.props.value;
  }

  render() {
    return <input id={this.props.id} className={cx('form-control', this.props.className)} placeholder={this.props.placeholder} name={this.props.name} onChange={this.onChange.bind(this)} value={this.getValue()}/>;
  }
}

suite('FormComponent component', function() {

  var updateValue = function(value) {
    this.node.value = value;
    TestUtils.Simulate.change(this.node);
  };

  var renderInput = function(props) {

    props = _.extend({}, {
      name: 'input-1',
      label: 'Input 1',
      onChange() {},
      onValid() {},
      onInvalid() {}
    }, props || {});

    this.onChange = props.onChange = sinon.spy(props.onChange);
    this.onValid = props.onValid = sinon.spy(props.onValid);
    this.onInvalid = props.onInvalid = sinon.spy(props.onInvalid);

    var renderedComponent = this.component = TestUtils.renderIntoDocument(
      <TestParent>
        <Input {...props}/>
      </TestParent>
    );

    this.node = TestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'input'
    );

    this.input = ReactDOM.findDOMNode(this.component);
  };

  var getInput = function() {
    return this.component.getChild();
  };

  suiteSetup('Bind functions', function() {
    renderInput = renderInput.bind(this);
    updateValue = updateValue.bind(this);
    getInput = getInput.bind(this);
  });

  test('Input markup should be valid', function() {
    renderInput();
    chai.assert.isTrue(this.node.classList.contains('form-control'));
  });

  test('Input should have an id', function() {
    renderInput();
    chai.assert(this.node.getAttribute('id'));
  });

  test('onChange should not be called on first render with default component value', function() {
    renderInput();
    chai.assert.equal(this.onChange.callCount, 0);
  });

  test('onChange should be called on first render with default value (not default component value)', function() {
    renderInput({
      defaultValue: 'defaultValue'
    });
    chai.assert.equal(this.onChange.callCount, 1);
  });

  test('onValid should be called on first render with default component value', function() {
    renderInput();
    chai.assert.equal(this.onValid.callCount, 1);
  });

  test('onValid should be called on first render with default value (not default component value)', function() {
    renderInput({
      defaultValue: 'defaultValue'
    });
    chai.assert.equal(this.onValid.callCount, 1);
  });

  test('Input should accept additional class names', function() {
    renderInput({ className: 'test-class'});
    chai.assert.isTrue(this.node.classList.contains('form-control'));
    chai.assert.isTrue(this.node.classList.contains('test-class'));
  });

  test('Changing input values should trigger onChange and onValid', function() {

    renderInput({
      onChange: () => {}
    });

    var callCounts = {
      onChange: this.onChange.callCount,
      onValid: this.onValid.callCount,
      onInvalid: this.onInvalid.callCount
    };

    updateValue('test');

    chai.assert.isTrue(this.onChange.calledWith('test'));
    chai.assert.equal(this.onChange.callCount, callCounts.onChange + 1);
    chai.assert.isTrue(this.onValid.calledWith('test'));
    chai.assert.equal(this.onValid.callCount, callCounts.onValid + 1);

    updateValue('test2');

    chai.assert.isTrue(this.onChange.calledWith('test2'));
    chai.assert.equal(this.onChange.callCount, callCounts.onChange + 2);
    chai.assert.isTrue(this.onValid.calledWith('test2'));
    chai.assert.equal(this.onValid.callCount, callCounts.onValid + 2);

    updateValue('test23');

    chai.assert.isTrue(this.onChange.calledWith('test23'));
    chai.assert.equal(this.onChange.callCount, callCounts.onChange + 3);
    chai.assert.isTrue(this.onValid.calledWith('test23'));
    chai.assert.equal(this.onValid.callCount, callCounts.onValid + 3);


    // onInvalid should never be invoked
    chai.assert.equal(this.onInvalid.callCount, 0);
  });

  test('Component isValid() should reflect value changes', function() {
    renderInput({
      validations: [Required]
    });

    chai.assert.isFalse(getInput().isValid());

    updateValue('test');

    chai.assert.isTrue(getInput().isValid());

    updateValue('');

    chai.assert.isFalse(getInput().isValid());

  });

  test('Invoke onChange events', function() {
    renderInput();

    updateValue('test');

    chai.assert.isTrue(this.onChange.calledWith('test'));
    chai.assert.isTrue(this.onChange.calledOnce);

    updateValue('test2');

    chai.assert.isTrue(this.onChange.calledWith('test2'));
    chai.assert.equal(this.onChange.callCount, 2);
  });

  test('Inputting invalid amounts should trigger the onInvalid callback', function() {
    renderInput({
      validations: [Required, Amount]
    });

    updateValue('');

    chai.assert.equal(this.onInvalid.callCount, 1);
    chai.assert.equal(this.onValid.callCount, 0);

    updateValue('2');

    chai.assert.equal(this.onInvalid.callCount, 1);
    chai.assert.equal(this.onValid.callCount, 1);

    updateValue('24.31');

    chai.assert.equal(this.onInvalid.callCount, 1);
    chai.assert.equal(this.onValid.callCount, 2);

    updateValue('2331jdaj23');

    chai.assert.equal(this.onInvalid.callCount, 2);
    chai.assert.equal(this.onValid.callCount, 2);

  });

  test('Inputting invalid amounts should reflect validation state', function() {

    renderInput({
      validations: [Required, Amount]
    });

    updateValue('');

    chai.assert.isFalse(getInput().isValid());

    updateValue('2');

    chai.assert.isTrue(getInput().isValid());

    updateValue('24.31');

    chai.assert.isTrue(getInput().isValid());

    updateValue('2331jdaj23');

    chai.assert.isFalse(getInput().isValid());

    chai.assert.equal('Amount should be a numeric value greater than 0.', getInput().getErrorMessage());

  });

  suite('Default values', function() {

    var defaultValue = 'defaultVALUE';

    var renderDefaultValueInput = function(props) {
      renderInput(_.extend({}, { defaultValue }, props));
    };

    test('Input should respect defaultValue', function() {
      renderDefaultValueInput();

      chai.assert.equal(getInput().getValue(), defaultValue);
      chai.assert.isTrue(getInput().isValid());
    });

    test('Input with a valid defaultValue triggers initial onChange and onValid callbacks', function() {
      chai.assert.equal(this.onChange.callCount, 1);
      chai.assert.equal(this.onInvalid.callCount, 0);
      chai.assert.equal(this.onValid.callCount, 1);
    });

    test('Input with an invalid defaultValue triggers initial onChange and onInvalid callbacks', function() {
      renderDefaultValueInput({
        validations: [Required, Amount]
      });

      chai.assert.equal(this.onChange.callCount, 1);
      chai.assert.equal(this.onInvalid.callCount, 1);
      chai.assert.equal(this.onValid.callCount, 0);
    });

    test('Value of input with defaultValue can be changed', function() {
      updateValue('asdfasd');
      chai.assert.equal(getInput().getValue(), 'asdfasd');
    });
  });

  test('Component can be controlled', function() {
    renderInput({
      value: 'test'
    });

    chai.assert.equal(getInput().getValue(), 'test');

    // Ensure onChange has not been called on first mount
    chai.assert.equal(this.onChange.callCount, 1);

    this.component.passPropsToChild({
      value: 'test2'
    });

    chai.assert.equal(getInput().getValue(), 'test2');

    // Ensure onChange has been called after value change
    chai.assert.equal(this.onChange.callCount, 2);

    this.component.passPropsToChild({
      value: 'test3'
    });

    chai.assert.equal(getInput().getValue(), 'test3');

    // Ensure onChange has been called after value change
    chai.assert.equal(this.onChange.callCount, 3);
  });

});
