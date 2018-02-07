import React from 'react';
import { connect } from 'react-redux';
import _each from 'lodash/each';
import _has from 'lodash/has';
import _every from 'lodash/every';
import shallowEqual from '@dodo/utils/lib/helpers/shallowEqual';
import shouldPureComponentUpdate from '@dodo/utils/lib/helpers/ui/shouldComponentUpdate';

import { bindActionCreatorsToNamespace } from './lib/helpers';
import { actionCreators as formActionCreators } from './middleware';

class FormComponent extends React.Component {
  /*eslint-disable no-unused-vars */
  static defaultProps = {
    // ClassName for form
    className: '',

    // Invoked on form submission
    onSubmit: (values) => {},

    // Invoked on form changes that result in a valid form
    onValid: (values) => {},

    // Invoked on form changes that result in an invalid form
    onInvalid: (values, errorPayload) => {},

    // Invoked only once when the form validation toggles to valid
    onJustValid: (values) => {},

    // Invoked only once when the form validation toggles to invalid
    onJustInvalid: () => {},

    // Invoked on every change event from children components, with the form values as arguments
    onChange: (values) => {},

    // Invoked whenever a child component triggers an onChange callback,
    // with an object containing a reference to the changed component,
    // its value, name, and validity
    onComponentChange: ({ component, value, name, isValid }) => {},

    // An object with the structure of:
    // { <name> : <value>, <name> : <value> }
    // which is used to prefill the form
    data: null
  };
  /*eslint-enable no-unused-vars */

  static propTypes = {
    form: React.PropTypes.string,
    className: React.PropTypes.string,
    initialValues: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    onValid: React.PropTypes.func,
    onInvalid: React.PropTypes.func,
    onJustValid: React.PropTypes.func,
    onJustInvalid: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onComponentChange: React.PropTypes.func,
    children: React.PropTypes.node
  };

  constructor(props) {
    super(props);

    // Placeholder for attached form components
    this._components = {};

    // Assume that the form starts as invalid with no values
    this._isValid = false;
    this._values = null;

    // Indicates whether the next validation to be run is a to be invoked as an
    // initial validation
    this._validationFirstRun = true;

    // Keep a flag indicating component mount state
    this._isMounted = false;

    this.props.doMount();

    this.onSubmit = this.onSubmit.bind(this);
  }

  // Context should provide a form object
  static childContextTypes = {
    form: React.PropTypes.object
  };

  /**
   * Context to pass to children
   */
  getChildContext() {
    return {
      form: {
        // Allows a FormComponent to attach to a form
        attachToForm: this.attachToForm.bind(this),

        // Allows a FormComponent to detach from a form
        detachFromForm: this.detachFromForm.bind(this),

        // Callback function for whenever a form component is updated
        onFormComponentUpdate: this.onFormComponentUpdate.bind(this),

        // Handle to the form's validation function which can be invoked
        // explicitly from children
        // USE WITH EXTREME CARE
        validate: this.validate.bind(this),

        initialValues: this.props.initialValues
      }
    };
  }

  componentWillMount() {
    this._startBulkChange();
  }

  componentWillReceiveProps(nextProps) {
    var isChange = false;

    _each(this._components, (component, name) => {
      if (component.value !== nextProps.values[name]) {
        component.value = nextProps.values[name];

        if (!isChange) {
          this._startBulkChange();
        }

        isChange = true;

        if (nextProps.values[name] === void 0) {
          component.component.reset();
        } else {
          component.component.setValue(nextProps.values[name], {
            fromRedux: true
          });
        }
      }
    });

    if (isChange) {
      this._endBulkChange();
    }
  }

  componentDidMount() {
    // Mark component as mounted
    this._isMounted = true;

    // Perform an initial validation on mount
    this._endBulkChange();
  }

  componentWillUnmount() {
    var { doDestroy } = this.props;

    // On component unmount destroy the form
    doDestroy();

    // Mark component as unmounted
    this._isMounted = false;
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  /**
   * Attaches a component to form
   * @param  {FormComponent} component - The component to attach to form
   */
  attachToForm(component) {
    var { doRegisterField } = this.props;

    var value = component.getValue();

    var name = component.getName();

    this._components[name] = {
      // Keep a reference to the component
      component,

      // Get the component value
      value
    };

    doRegisterField(name, value, {
      pristine: component.isPristine(),
      touched: component.isTouched(),
      error: component.getErrorMessage(),
      valid: component.isValid()
    });

    // Perform a form validation
    this.validate();
  }

  /**
   * Detaches a component from form
   * @param  {FormComponent} component - The component to detach from form
   */
  detachFromForm(component) {
    var { doUnregisterField } = this.props;

    delete this._components[component.getName()];

    doUnregisterField(name);

    // Perform a form validation
    this.validate();
  }

  /**
   * Returns the current values of the form
   * @return {Object} values - Form values
   */
  getValues() {
    var values = {};

    // Iterate through each component and get its value
    _each(this._components, (val, key) => {
      values[key] = val.value;
    });

    return values;
  }

  /**
   * Alias for getValues()
   * @return {Object} values - Form values
   */
  getData = this.getValues;

  /**
   * Callback function that is called by children FormComponent components
   * when they change
   * @param  {FormComponent} component - The component that invoked the callback function
   */
  onFormComponentUpdate(component) {
    var { doChangeField } = this.props;
    var { name } = component.props;
    var value = component.getValue();
    this._components[name].value = value;
    this.validate();

    doChangeField(name, value, {
      pristine: component.isPristine(),
      touched: component.isTouched(),
      error: component.getErrorMessage() || null,
      valid: component.isValid()
    });

    this.props.onComponentChange({
      value,
      name,
      isValid: component.isValid()
    });
  }

  /**
   * Marks that a bulk change is going to start. This ensures that this.validate()
   * is only invoked *once* at the end of the bulk change, when this._endBulkChange()
   * is called
   */
  _startBulkChange() {
    this._bulkChange = true;
  }

  /**
   * Marks that a bulk change has just ended. An explicit this.validate() is invoked
   * on the new data
   */
  _endBulkChange() {
    this._bulkChange = false;
    this.validate();
  }

  /**
   * Set the form data as a bulk change
   * @param {Object} data - The form data
   * @param {boolean} [partial=false] - Flag indicating whether this is a partial
   * or entire form change. If not partial, keys missing from the passed data object
   * are explicitly reset
   */
  setData(data, partial = false) {
    // Store explicit data for future-mounted components
    this._explicitData = data;

    // Register the bulk change
    this._startBulkChange();

    // Iterate through each component
    _each(this._components, (_component, name) => {
      // Set the data to the component, if the data object has a reference to
      // the component's name
      if (_has(data, name)) {
        _component.component.setValue(data[name]);
      } else {
        // Reset the component if this operation is not partial, and there is no
        // explicit value in the passed data object
        if (!partial) {
          _component.component.reset();
        }
      }
    });

    // End the bulk change
    this._endBulkChange();
  }

  /**
   * Reset the whole form
   */
  reset() {
    // Register the bulk change
    this._startBulkChange();

    // Reset each component
    _each(this._components, (_component) => {
      _component.component.reset();
    });

    // End the bulk change
    this._endBulkChange();
  }

  /**
   * Validate the form *lazily*. `Force` flag can be passed to validate the
   * form greedily
   *
   * FormComponent's are iterated and their .isValid() method is called. This
   * does not trigger validation but queries the current validation state of the
   * component
   *
   * Sets the component state values to the new values
   *
   * Triggers `onChange`, `onValid`, `onJustValid`, 'onInvalid`, `onJustInvalid`
   * callbacks where necessary
   *
   * This will return false if the form is not mounted or a bulk change is in
   * progress.
   *
   * @param {boolean} [force=false] - Flag to validate form greedily
   * @return {boolean} Whether the entire form is valid or not
   */
  validate(force = false) {
    var { doSetValid } = this.props;

    // Skip and return false if a bulk change is in progress
    if (this._bulkChange || !this._isMounted) {
      return false;
    }

    // Form is valid iff all components are valid
    var isValid = _every(this._components, (_component) => {
      var component = _component.component;

      // Trigger a force validation on the component
      if (force) {
        component.forceValidate();
      }

      return component.isValid();
    });

    // Get the stale form values
    var values = this.getValues();

    // Check if they are equal to the current values
    if (!shallowEqual(this._values, values)) {
      if (!this._validationFirstRun || this.props.initialValues) {
        // Trigger the onChange event if it's not the first validation run
        // or there is prefill data
        this.props.onChange(values, this._values);
      }

      // Set the new values
      this._values = values;
    }

    if (isValid) {
      if (!this._isValid) {
        // Mark form as valid
        this._isValid = true;

        doSetValid(true);

        // Only trigger the onJustValid callback if the form was previously
        // invalid
        this.props.onJustValid(values);
      }

      // Always trigger the onValid callback
      this.props.onValid(values);
    } else {
      // Generate an errorPayload, an array for each invalid component
      var errorPayload = [];

      _each(this._components, (_component) => {
        // Skip if component is valid
        if (_component.component.isValid()) {
          return;
        }

        // Create a payload for this component,
        // containing the error message, value, and a reference to the component
        var payload = {};

        // Get the error message
        payload.message = _component.component.getErrorMessage();

        // Get the value
        payload.value = _component.component.getValue();

        // Push to payload arrow
        errorPayload.push(payload);
      });

      if (this._isValid || this._validationFirstRun) {
        // Mark form as invalid
        this._isValid = false;
        doSetValid(false);
        // Only trigger the onJustInvalid callback if the form was previously
        // valid or this is the first validation run
        this.props.onJustInvalid(values, errorPayload);
      }

      // Always trigger the onInvalid callback
      this.props.onInvalid(values, errorPayload);
    }

    // First validation has been run
    this._validationFirstRun = false;

    return isValid;
  }

  /**
   * Handles the form's onSubmit event. Default browser behaviour is prevented.
   * onSubmit prop is invoked with form values
   */
  onSubmit(event) {
    // Prevent default browser behaviours
    event.preventDefault();

    // Call the onSubmit prop function with form values
    this.props.onSubmit(this.getValues());
  }

  render() {
    return (
      <form
        className={this.props.className}
        onSubmit={this.onSubmit}
        noValidate
      >
        {this.props.children}
      </form>
    );
  }
}

// Connect the form component to the redux store
const ConnectedFormComponent = connect(
  (state, ownProps) => ({ ...state.form[ownProps.form], ...ownProps }),
  (dispatch, props) =>
    bindActionCreatorsToNamespace(formActionCreators, props.form, dispatch),
  null,
  { withRef: true }
)(FormComponent);

export { FormComponent, ConnectedFormComponent };

export default ConnectedFormComponent;
