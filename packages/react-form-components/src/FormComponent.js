/*  eslint jsx-a11y/label-has-for: 0 */
/*  eslint react/jsx-no-bind: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _uniqueId from 'lodash/uniqueId';
import _extend from 'lodash/extend';
import _first from 'lodash/head';
import _pick from 'lodash/pick';
import _contains from 'lodash/includes';
import _filter from 'lodash/filter';
import _every from 'lodash/every';
import _has from 'lodash/has';
import _get from 'lodash/get';
import _map from 'lodash/map';
import Required from '@dodo/utils/lib/validators/common/required';
import shallowEqual from '@dodo/utils/lib/helpers/shallowEqual';
import shouldPureComponentUpdateCompareArrays from '@dodo/utils/lib/helpers/ui/shouldPureComponentUpdateCompareArrays';

/**
 * A Higher-Order-Component that makes a component form-friendly. Used in
 * conjunction with the Form component.
 * @param  {Component} ComposedComponent - The component to decorate
 * @return {FormComponent} The decorated component
 */
var MakeFormComponent = function(ComposedComponent) {
  class FormComponent extends React.Component {
    /*eslint-disable no-unused-vars */
    static defaultProps = {
      asyncValidation: null,
      className: '',
      disabled: false,
      groupClassName: 'col',
      initialOnChange: true,
      inputAfter: null,
      inputBefore: null,
      isPartOfForm: true,
      label: '',
      masker: null,
      name: '',
      onChange: () => {},
      onInvalid: () => {},
      onMaskInvalid: () => {},
      onMaskValid: () => {},
      onValid: () => {},
      showValidationUI: true,
      validations: [],
      value: null,
      wrapAround: true
    };
    /*eslint-enable no-unused-vars */

    static propTypes = {
      asyncValidation: PropTypes.shape({
        validate: PropTypes.func
      }),
      className: PropTypes.string,
      defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.array,
        PropTypes.object,
        PropTypes.number
      ]),
      disabled: PropTypes.bool,
      groupClassName: PropTypes.string,
      inputAfter: PropTypes.node,
      inputBefore: PropTypes.node,
      isPartOfForm: PropTypes.bool,
      label: PropTypes.string,
      masker: PropTypes.shape({
        mask: PropTypes.func
      }),
      name: PropTypes.string,
      onChange: PropTypes.func,
      onInvalid: PropTypes.func,
      onMaskInvalid: PropTypes.func,
      onMaskValid: PropTypes.func,
      onValid: PropTypes.func,
      showValidationUI: PropTypes.bool,
      validations: PropTypes.array,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.array,
        PropTypes.object,
        PropTypes.number
      ]),
      wrapAround: PropTypes.bool
    };

    // Perform a shallow equal comparison
    shouldComponentUpdate = shouldPureComponentUpdateCompareArrays;

    // Expected context type
    static contextTypes = {
      form: PropTypes.object
    };

    constructor(props) {
      super(props);

      // Generate unique id for the component
      this._id = _uniqueId(`form-group-${props.name || ''}`);

      // `formComponentProps` is the props that govern how the decorator should
      // function and handle the decorated component. Such as whether to wrap
      // the component around as a form group (with label and validation errors)
      // and whether to show validation indicators
      var formComponentProps = {};

      // The decorated component can choose to override default FormComponent
      // props by definining a static method `getFormComponentProps`, returning
      // an object to override props with
      if (ComposedComponent.getFormComponentProps) {
        formComponentProps = ComposedComponent.getFormComponentProps.call(this);
      }

      // Extend with defaults
      this.formComponentProps = _extend(
        {},
        {
          // Wrap around as a form group. Default is the prop `wrapAround` which
          // is `true` by default
          wrapAround: this.props.wrapAround,

          // Show validation indicators by default
          showIndicators: true,

          // This is the form component's default value, regardless of whether it
          // is controlled or not. This is the value of a fresh component. For
          // example, an input field has a default value of '', while a checkbox
          // has a default value of `false`.
          defaultValue: '',

          // Whether to trigger an onChange callback if the value differs from the
          // default value on component mount
          initialOnChange: true
        },
        formComponentProps
      );

      // Wrap onChange callback so that the decorated component can notify of
      // value changes
      this.childProps = {
        onChange: (value) => {
          this.setValue(value, {
            isTouched: true
          });
        }
      };

      // Initial state
      this.state = this.getDefaultState();

      // Get a consistent state copy for external use.
      // See method description for more information.
      this._updateConsistentState(this.state);
    }

    /**
     * Update the consistent state `this._state` variable with the latest state
     * data.
     *
     * This adds synchronosity to the Form component
     * This is very debatable and am not 100% satisfied with this decision
     * but it offers great flexibility:
     * - Can guarantee synchronosity with the parent Form component
     * - Parent Form component is optional! Going with a Flux-y
     * 		implementation would mean that all form state needs to
     * 		be stored in the parent component (or another common ancestor)
     * @param  {Object} state - state to update values from
     */
    _updateConsistentState(state) {
      this._state = _pick(state, [
        'value',
        'isValid',
        'validationError',
        'validationErrorOverride',
        'isPristine',
        'isTouched'
      ]);
    }

    componentWillMount() {
      // Determine the component's initial value
      var value;

      // Check if the form has any prefill data with the component's name
      var explicitData;

      if (this.isPartOfForm()) {
        explicitData = this.context.form.initialValues;
      }

      if (explicitData) {
        // Use the explicit set data
        value = _get(explicitData, this.props.name);

        if (value === void 0) {
          value = this.getDefaultValue();
        }
      } else {
        // Set default value
        value = this.getDefaultValue();
      }

      // Set determined value
      this.setValue(value, {
        // `isPristine` is only true if the determined value is not the same as
        // the form component's default value
        isPristine: shallowEqual(value, this.formComponentProps.defaultValue)
      });

      if (this.isPartOfForm()) {
        // Attach to form
        this.context.form.attachToForm(this);

        // Keep track that component is currently attached to a form
        this._isAttached = true;
      }
    }

    componentDidMount() {
      // Keep track that component is mounted
      this._isMounted = true;
    }

    componentWillUnmount() {
      if (this.isPartOfForm()) {
        // Detach from form
        this.context.form.detachFromForm(this);

        // Mark that component is no longer attached
        this._isAttached = false;
      }

      // Mark that component will be unmounted
      this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.validationError) {
        this.setState({
          validationError: nextProps.validationError
        });
      }
    }

    componentDidUpdate(prevProps) {
      // Check if value is specified and current value is different then the
      // new value, set as the new value, optionally silently
      if (
        this.props.value !== null &&
        !shallowEqual(this.state.value, this.props.value)
      ) {
        if (
          !(
            this.props.masker &&
            this.props.masker.mask(
              ...[String(this.props.value), this.state.value, this]
            )
          )
        ) {
          this.setValue(this.props.value, { silent: this.props.silent });
        }
      } else {
        // If validations have changed, re-set the value and go through the
        // validation flow. Retain pristinity.
        if (
          !shallowEqual(this.props.validations, prevProps.validations) ||
          !shallowEqual(this.props.asyncValidation, prevProps.asyncValidation)
        ) {
          this.setValue(this.state.value, {
            silent: this.props.silent,
            isPristine: this.state.isPristine
          });
        }
      }
    }

    /**
     * Returns the current form component's value
     * @return {(?Object|number|string|boolean|Array)} value
     */
    getValue() {
      return this._state.value;
    }

    /**
     * Returns the form component's validation state
     * @return {Boolean} isValid
     */
    isValid() {
      return this._state.isValid;
    }

    /**
     * Returns the form component's touched state
     * @return {Boolean} isTouched
     */
    isTouched() {
      return this._state.isTouched;
    }

    /**
     * Returns the default value of the form component.
     * The default value is an inferred value and is:
     * 		- The value passed as a prop (`props.value`) if the component is
     * 			controlled
     * 		- The default value passed as a prop (`props.defaultValue`), if it is
     * 			specified
     * 		- The result of the `getDefaultValue` method of the decorated
     * 			component if the method is defined
     * 		- The `defaultValue` property of the decorated component
     * @return {(Object|number|string|boolean|Array)} defaultValue
     */
    getDefaultValue() {
      // A controlled component should return the provided value
      if (this.isControlled()) {
        return this.props.value;
      }

      // If the defaultValue prop is specified
      if (
        _has(this.props, 'defaultValue') &&
        this.props.defaultValue !== null
      ) {
        return this.props.defaultValue;
      }

      // A decorated component can choose to define a `getDefaultValue` method
      if (ComposedComponent.prototype.getDefaultValue) {
        return ComposedComponent.prototype.getDefaultValue.call(this);
      }

      // The `defaultValue` of the decorated component
      return this.formComponentProps.defaultValue;
    }

    /**
     * Returns the default state for the component
     * @return {Object} state
     */
    getDefaultState() {
      return {
        isPristine: true
      };
    }

    /**
     * Returns whether the current component has asynchronous validation
     * @return {Boolean} hasAsyncValidation
     */
    hasAsyncValidation() {
      return !!this.props.asyncValidation;
    }

    /**
     * Returns whether the current component is part of a form, or rather,
     * if the component is attached to a form
     * @return {Boolean} isPartOfForm
     */
    isPartOfForm() {
      return this.context.form && this.props.isPartOfForm;
    }

    /**
     * Checks if the component is being controlled or not
     * @return  {boolean} isControlled
     */
    isControlled() {
      return _has(this.props, 'value') && this.props.value !== null;
    }

    /**
     * Returns the name of the component
     * @return {String} name
     */
    getName() {
      return this.props.name;
    }

    /**
     * Checks whether a property in the component's state has changed with
     * respect to an object passed as the first argument
     * @param  {Object} state - object to compare the component's state to
     * @param  {String} prop - the property's name to compare
     * @return {Boolean} whether the properties are different
     */
    didStatePropChange(state, prop) {
      return !shallowEqual(this.state[prop], state[prop]);
    }

    /**
     * Reset the form component. Resets the value, validation state,
     * and validation errors. Invokes the decorated component's `reset` method
     * if defined
     */
    reset() {
      // Get the default value
      var value = this.getDefaultValue();

      // Set the value, isPristine is set to true if the value to reset to is
      // the same as the `defaultValue`
      this.setValue(value, {
        isPristine: shallowEqual(value, this.formComponentProps.defaultValue)
      });

      // Call the decorated component's `reset` method if defined
      if (this._component.reset) {
        this._component.reset();
      }
    }

    /**
     * Trigger callbacks, conditionally. An `options` argument can be used to
     * explicitly disable or enable different callbacks (`onChange`, `onValid`
     * and `onInvalid`)
     * @param  {Object} state - the state object as payload for callbacks
     * @param  {?Object} options - Disable or enable callbacks
     */
    triggerCallbacks(state, options) {
      options = _extend(
        {},
        {
          onChange: !this.isControlled(),
          onValid: true,
          onInvalid: true,
          didValidChange: false
        },
        options
      );

      var { value, isValid } = this._state;

      options.onChange && this.props.onChange(value);

      if (this.isPartOfForm() && this._isAttached) {
        if (
          !options.fromRedux ||
          (options.fromRedux && options.didMetaChange)
        ) {
          this.context.form.onFormComponentUpdate(this);
        }
      }

      if (isValid) {
        options.onValid && this.props.onValid(value);
      } else {
        options.onInvalid && this.props.onInvalid(value);
      }
    }

    /**
     * Returns the error validation message
     * @return {?String} errorMessage
     */
    getErrorMessage() {
      return this._state.validationError || this._state.validationErrorOverride;
    }

    /**
     * Set state and trigger callbacks. Checks for what callbacks need to be
     * triggered.
     * @param {Object}   state - the state to set
     * @param {?Object}   options - options object, a `silent` property can be
     *                            	specified to not trigger callbacks
     * @param {Function} cb - callback for when state is set
     */
    setStateAndTriggerCallbacks(state, options, cb) {
      options = options || {};

      // Only trigger `onChange` if the value has changed
      var onChange = this.didStatePropChange(state, 'value');

      // Do not trigger the `onChange` callback if:
      // - component is not yet mounted
      // - `initialOnChange` is disabled or the value is the same as the
      //    component's default value
      if (
        !this._isMounted &&
        (!this.formComponentProps.initialOnChange ||
          this.formComponentProps.defaultValue === state.value)
      ) {
        onChange = false;
      }

      // Apply changes to the consistent state
      this._updateConsistentState(_extend({}, this.state, state));

      // Set the state, which may be asynchronous
      this.setState(state, cb);

      // Do not trigger callbacks if `silent` flag is provided
      if (!options.silent) {
        var didValidChange = this.didStatePropChange(state, 'isValid');
        var onValid = state.isValid && (onChange || didValidChange);
        var onInvalid = !state.isValid && (onChange || didValidChange);
        var didMetaChange =
          didValidChange || this.didStatePropChange(state, 'isPristine');

        this.triggerCallbacks(state, {
          onChange,
          onValid,
          onInvalid,
          didMetaChange,
          fromRedux: options.fromRedux
        });
      }
    }

    /**
     * Validate the component by running only the synchronous validations.
     * Asynchronous validations are not executed.
     * @param  {(Object|number|string|boolean|Array)} value - the value to
     *                                                      validate
     * @return {Object} validationResult - an object containing an `isValid`
     *                                   property, and an array of error
     *                                   messages
     */
    validateSync(value) {
      // Execute all the validations and store results in an array
      var results = _map(this.props.validations, (validator) => {
        return validator.validate(value);
      });

      // The component is only valid if all validation results are valid
      var isValid = _every(results, (result) => {
        return result.valid;
      });

      // If valid, return the validationResult
      if (isValid) {
        return {
          isValid: true
        };
      }

      // Get the list of errors
      var errors = _filter(results, (result) => {
        return !result.valid;
      });

      return {
        isValid: false,

        // Provide the messages
        messages: _map(errors, 'message')
      };
    }

    /**
     * Validate the component asynchronously.
     * @param  {(Object|number|string|boolean|Array)} value - the value to
     *                                                      validate
     * @return {Promise} validationResult
     */
    validateAsyncOnly(value) {
      // Validate component synchronously (only synchronous validators)
      var results = this.validateSync(value);

      // Always return a promise
      return new Promise((resolve, reject) => {
        // Only perform asynchronous validation if synchronous validation is
        // successful. It is useless to perform an asynchronous validation if
        // the current input is not valid
        if (this.hasAsyncValidation() && results.isValid) {
          // Asynchronous validation object should have a `validate` method
          // that returns a promise. See `AsyncValidator`.
          this.props.asyncValidation
            .validate(value)
            .then(() => {
              // Resolve if successful
              resolve();
            })
            // On failure, reject with an array of error messages
            .catch((error) => {
              // If `error` is a string, wrap in an array
              if (typeof error === 'string') {
                return reject([error]);
              }

              // Else, assume that payload has a `message` property and wrap in
              // an array
              reject([error.message]);
            });
        } else {
          // If component does not have an asynchronous validator,
          // resolve/reject the promise immediately
          if (results.isValid) {
            resolve();
          } else {
            reject(results.messages);
          }
        }
      });
    }

    // Initial mask validation is false
    maskValid = false;

    /**
     * Runs the masker function on the current value
     * @return {(Object|number|string|boolean|Array)} maskValue
     */
    runMaskOnCurrentValue() {
      if (this._isMounted) {
        return this.maskValue(this.state.value);
      }
    }

    /**
     * Mask the provided value
     * @param  {(string)} value - value to mask
     * @return {(string)} maskValue - masked value
     */
    maskValue(value) {
      // Clear the mask timeout. Mask is executed again after a possible input
      // is deemed to be invalid (`onMaskInvalid`) to refresh the component
      // state with the masked value
      clearTimeout(this.maskTimeout);

      // No need to mask a falsy value
      if (!value) {
        return null;
      }

      // Check length of current value
      var currentLength = (this.state.value || '').length;

      // Get the new length of the value
      var newLength = value.length;

      // Treat the action as a `delete` action if the new length is less than
      // the current length
      var isDeleting = newLength < currentLength;

      // Keeps the masked value to return later on
      var maskedValue;

      // Keeps whether the input to mask is valid
      var maskedValid;

      // Run the masker
      var maskedResult = this.props.masker.mask(
        ...[String(value), this.state.value, this, null, isDeleting]
      );

      // Get the value from the masked result
      maskedValue = maskedResult.value;

      // Get the validation state from the masked result
      maskedValid = maskedResult.isValid;

      // Set the `validationError`. Empty if valid, the message if not.
      this.setState({
        validationErrorOverride: maskedValid ? '' : maskedResult.message
      });

      // Trigger an `onMaskValid` callback if validation state changed
      if (maskedValid && !this.maskedValid) {
        this.props.onMaskValid();
      }

      // Trigger an `onMaskInvalid` callback if validation state changed
      if (!maskedValid && (this.maskedValid || this.maskedValid === null)) {
        this.props.onMaskInvalid(maskedResult.message);
      }

      // If mask is invalid, run the mask again after 2 seconds
      if (!maskedValid) {
        this.maskTimeout = setTimeout(() => {
          this.runMaskOnCurrentValue();
        }, 2000);
      }

      // Keep track of the mask validation result for use on the next mask
      // validation
      this.maskedValid = maskedValid;

      // Return the masked value
      return maskedValue || '';
    }

    isPristine() {
      return this._state.isPristine;
    }

    /**
     * Set the value of the component.
     * @param {(Object|number|string|boolean|Array)}   value - the value to set
     * @param {?Object}   options - Define if the operation should happen
     *                            silently (`silent`: true), and if the
     *                            component should be set as pristine
     *                            (`isPristine`: true)
     * @param {Function} cb - Callback since this may happen asynchronously
     */
    setValue(value, options, cb) {
      // Extend options with defaults
      options = _extend(
        {},
        {
          isTouched: false,
          isPristine: false,
          silent: false
        },
        options
      );

      // Mask if a masker is specifeid
      if (this.props.masker) {
        value = this.maskValue(value);
      }

      // `isPristine` is determined by the options, default is false
      var { isPristine, isTouched } = options;

      // Validate synchronously
      var validationResult = this.validateSync(value);

      // Check if value is valid
      var isValid = validationResult.isValid;

      // Get the validation error message
      var validationError = _first(validationResult.messages) || '';

      // Perform asynchronous validation if value `isValid`
      if (isValid && this.hasAsyncValidation()) {
        // Set component as invalid (we do not know yet whether the value is
        // valid or not since it has asynchronous validation)
        isValid = false;

        // Remove any current validation error messages
        validationError = '';

        // Use the asynchronous validator to validate the value
        // Keep a reference to the returned promise so it can be disregarded
        // if a new promise is created in the meantime
        var currentValidatingAsync = (this.validatingAsync = this.validateAsyncOnly(
          value
        )
          .then(() => {
            // Skip if this is not the latest async validation operation
            if (this.validatingAsync !== currentValidatingAsync) {
              return false;
            }

            // Update the state and trigger respective callbacks
            this.setStateAndTriggerCallbacks(
              {
                isValid: true,
                validationError: '',
                isPristine
              },
              options
            );
          })
          .catch((messages) => {
            // Skip if this is not the latest async validation operation
            if (this.validatingAsync !== currentValidatingAsync) {
              return false;
            }

            // Update the state and trigger respective callbacks
            this.setStateAndTriggerCallbacks(
              {
                isValid: false,
                validationError: _first(messages)
              },
              options
            );
          }));
      }

      // Set the state to update to
      var state = {
        value,
        isValid,
        isPristine,
        isTouched,
        validationError
      };

      // Update the state and trigger respective callbacks
      this.setStateAndTriggerCallbacks(state, options, cb);

      // Return the new state
      return state;
    }

    /**
     * Force component validation by re-setting the value
     */
    forceValidate() {
      this.setValue(this.getValue());
    }

    /**
     * Render the label if needed
     * @return {ReactComponent} - component
     */
    renderLabel() {
      if (!this.props.label) {
        return null;
      }

      // Add a `required` class if the component has a `Required` validator
      var className = cx({
        required: _contains(this.props.validations, Required)
      });

      // If the label is a string (not a component), set directly as HTML
      // since it may contain HTML tags and entities
      var isLabelString = typeof this.props.label === 'string';

      var labelProps = {};

      if (isLabelString) {
        labelProps.dangerouslySetInnerHTML = {
          __html: this.props.label
        };
      }

      return (
        <div className="form-group-label-wrapper">
          <label htmlFor={this._id} className={className} {...labelProps}>
            {isLabelString ? null : this.props.label}
          </label>
        </div>
      );
    }

    /**
     * Render the composed (decorated) component
     * @return {ReactComponent} - component
     */
    renderComposedComponent() {
      // Merge the props, including the state of the component
      var props = {
        _parent: this,
        id: this._id,
        ...this.props,
        ...this.childProps,
        ...this.state
      };

      // Keep a reference to the composed component
      return (
        <ComposedComponent ref={(c) => (this._component = c)} {...props} />
      );
    }

    /**
     * Render the component to display before the compose component
     * @return {ReactComponent} - component
     */
    renderBeforeComponent() {
      return this.props.inputBefore ? (
        <div className="input-before" ref={(c) => (this._inputBefore = c)}>
          {this.props.inputBefore}
        </div>
      ) : null;
    }

    /**
     * Render the component to display after the compose component
     * @return {ReactComponent} - component
     */
    renderAfterComponent() {
      return this.props.inputAfter ? (
        <div className="input-after" ref={(c) => (this._inputAfter = c)}>
          {this.props.inputAfter}
        </div>
      ) : null;
    }

    render() {
      // The component is invalid (in terms of UI) if there is a validation
      // error or a validation error message override
      var hasError =
        !this.state.isValid ||
        this.state.validationError ||
        this.state.validationErrorOverride;

      // Negation of `hasError`
      var hasSuccess = !hasError;

      // Show validation UI if component is not pristine
      var canShowValidationUI = this.props.showValidationUI;
      var showValidationUI = canShowValidationUI && !this.state.isPristine;

      var inputValidationClass = cx(
        'form-control-validation',
        'animated',
        'bounceIn',
        {
          'form-control-validation--success': showValidationUI && hasSuccess,
          'form-control-validation--error': showValidationUI && hasError
        }
      );

      var formGroupClass = cx(
        'form-group',
        {
          'form-group--error': showValidationUI && hasError,
          'form-group--success': showValidationUI && hasSuccess,
          'form-group--disabled': this.props.disabled
        },
        this.props.groupClassName,
        this.formComponentProps.className
      );

      var formGroupControlWrapperClass = cx('form-group-control-wrapper', {});

      return this.formComponentProps.wrapAround ? (
        <div className={formGroupClass}>
          {this.renderLabel()}

          <div className={formGroupControlWrapperClass}>
            {this.renderBeforeComponent()}
            {this.renderComposedComponent()}
            {this.renderAfterComponent()}
            {this.formComponentProps.showIndicators ? (
              <div className={inputValidationClass} />
            ) : null}
          </div>

          {canShowValidationUI ? (
            <ul className="form-group-errors-list">
              {showValidationUI && hasError ? (
                <li className="form-group-error-list-item">
                  {this.state.validationError ||
                    this.state.validationErrorOverride}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      ) : (
        this.renderComposedComponent()
      );
    }
  }

  return FormComponent;
};

export default MakeFormComponent;
