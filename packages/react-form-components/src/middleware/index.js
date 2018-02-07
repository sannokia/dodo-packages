import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _each from 'lodash/each';
import _extend from 'lodash/extend';
import _has from 'lodash/has';

import formActionTypes from './actionTypes';

var initialState = {
  isMounted: false,
  valid: false,
  initialValues: {},
  values: {},
  components: {}
};

const doMount = (form) => ({ type: formActionTypes.MOUNT, meta: { form } });

const doDestroy = (form) => ({ type: formActionTypes.DESTROY, meta: { form } });

const doSetInitialValues = (form, data) => ({
  type: formActionTypes.SET_INITIAL_VALUES,
  meta: { form },
  payload: { data }
});

const doResetField = (form, name, value, meta) => ({
  type: formActionTypes.RESET_FIELD,
  meta: { form },
  payload: { name, value, meta }
});

const doChangeField = (form, name, value, meta) => ({
  type: formActionTypes.CHANGE_FIELD,
  meta: { form },
  payload: { name, value, meta }
});

const doSetFieldValue = (form, name, value) => ({
  type: formActionTypes.SET_FIELD_VALUE,
  meta: { form },
  payload: { name, value }
});

const doRegisterField = (form, name, value, meta) => ({
  type: formActionTypes.REGISTER_FIELD,
  meta: { form },
  payload: { name, value, meta }
});

const doUnregisterField = (form, name) => ({
  type: formActionTypes.UNREGISTER_FIELD,
  meta: { form },
  payload: { name }
});

const doSetValid = (form, value) => ({
  type: formActionTypes.SET_VALID,
  meta: { form },
  payload: value
});

const doReset = (form) => ({ type: formActionTypes.RESET, meta: { form } });

const doSetData = (form, data, partial) => ({
  type: formActionTypes.SET_DATA,
  meta: { form },
  payload: { data, partial }
});

function applyRegisterField(state, action) {
  var { components = {}, values = {} } = state;
  var { payload: { name, value, meta } } = action;

  var newFields = { ...components, [name]: { name, meta } };

  var newValues = { ...values, [name]: value };

  return { ...state, components: newFields, values: newValues };
}

function applyUnregisterField(state, action) {
  var { components, values } = state;
  var { payload: { name } } = action;

  var newFields = _omit(components, name);

  var newValues = _omit(values, name);

  return { ...state, components: newFields, values: newValues };
}

function applyChangeField(state, action) {
  var { payload: { name, value, meta } } = action;
  var { values, components } = state;

  var newFields = { ...components, [name]: { name, meta } };

  var newValues = { ...values, [name]: value };

  return { ...state, values: newValues, components: newFields };
}

function applySetFieldValue(state, action) {
  var { payload: { name, value } } = action;
  var { values } = state;

  var newValues = { ...values, [name]: value };

  return { ...state, values: newValues };
}

function applySetInitialValues(state, action) {
  var { payload: { data } } = action;

  return { ...state, initialValues: data };
}

function applyReset(state) {
  var { components, initialValues } = state;
  var newValues = {};
  var newFields = {};

  _each(components, (component, name) => {
    let newValue;

    if (_has(initialValues, name)) {
      newValue = initialValues[name];
    }

    newValues[name] = newValue;
    newFields[name] = _extend({}, components[name], {
      name,
      meta: { pristine: true, touched: false }
    });
  });

  return { ...state, values: newValues, components: newFields };
}

function applySetData(state, action) {
  var { components, values } = state;
  var { data, partial = false } = action.payload;
  var newValues = {};
  var newFields = {};

  _each(components, (component, name) => {
    let newValue;

    if (_has(data, name)) {
      newValue = data[name];
    } else {
      if (partial) {
        newValue = values[name];
      }
    }

    newValues[name] = newValue;
    newFields[name] = _extend({}, components[name], {
      name,
      meta: { pristine: true, touched: false }
    });
  });

  return { ...state, values: newValues, components: newFields };
}

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case formActionTypes.MOUNT:
      return { ...initialState, isMounted: true };
    case formActionTypes.DESTROY:
      return { ...initialState };
    case formActionTypes.SET_INITIAL_VALUES:
      return applySetInitialValues(state, action);
    case formActionTypes.REGISTER_FIELD:
      return applyRegisterField(state, action);
    case formActionTypes.UNREGISTER_FIELD:
      return applyUnregisterField(state, action);
    case formActionTypes.CHANGE_FIELD:
      return applyChangeField(state, action);
    case formActionTypes.RESET_FIELD:
      return applyChangeField(state, action);
    case formActionTypes.SET_FIELD_VALUE:
      return applySetFieldValue(state, action);
    case formActionTypes.SET_DATA:
      return applySetData(state, action);
    case formActionTypes.SET_VALID:
      return { ...state, valid: action.payload };
    case formActionTypes.RESET:
      return applyReset(state, action);
    default:
      return state;
  }
};

const byForm = (reducer) => {
  return (state = {}, action = {}) => {
    const form = action && action.meta && action.meta.form;

    if (!form) {
      return state;
    }

    const formState = _get(state, form);

    const result = reducer(formState, action);

    return result === formState
      ? { ...state }
      : { ...state, [form]: { ...result } };
  };
};

const actionCreators = {
  doMount,
  doDestroy,
  doSetInitialValues,
  doRegisterField,
  doUnregisterField,
  doResetField,
  doSetValid,
  doChangeField,
  doSetFieldValue,
  doReset,
  doSetData
};

export { initialState, actionCreators };

export default byForm(reducer);
