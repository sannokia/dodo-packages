import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _each from 'lodash/each';
import _extend from 'lodash/extend';
import _has from 'lodash/has';

import {
  MOUNT,
  DESTROY,
  SET_INITIAL_VALUES,
  CHANGE_FIELD,
  REGISTER_FIELD,
  UNREGISTER_FIELD,
  RESET_FIELD,
  SET_FIELD_VALUE,
  SET_VALID,
  SET_DATA,
  RESET
} from './actionTypes';

var initialState = {
  isMounted: false,
  valid: false,
  initialValues: {},
  values: {},
  components: {}
};

const doMount = (form) => ({ type: MOUNT, meta: { form } });

const doDestroy = (form) => ({ type: DESTROY, meta: { form } });

const doSetInitialValues = (form, data) => ({
  type: SET_INITIAL_VALUES,
  meta: { form },
  payload: { data }
});

const doResetField = (form, name, value, meta) => ({
  type: RESET_FIELD,
  meta: { form },
  payload: { name, value, meta }
});

const doChangeField = (form, name, value, meta) => ({
  type: CHANGE_FIELD,
  meta: { form },
  payload: { name, value, meta }
});

const doSetFieldValue = (form, name, value) => ({
  type: SET_FIELD_VALUE,
  meta: { form },
  payload: { name, value }
});

const doRegisterField = (form, name, value, meta) => ({
  type: REGISTER_FIELD,
  meta: { form },
  payload: { name, value, meta }
});

const doUnregisterField = (form, name) => ({
  type: UNREGISTER_FIELD,
  meta: { form },
  payload: { name }
});

const doSetValid = (form, value) => ({
  type: SET_VALID,
  meta: { form },
  payload: value
});

const doReset = (form) => ({ type: RESET, meta: { form } });

const doSetData = (form, data, partial) => ({
  type: SET_DATA,
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
    case MOUNT:
      return { ...initialState, isMounted: true };
    case DESTROY:
      return { ...initialState };
    case SET_INITIAL_VALUES:
      return applySetInitialValues(state, action);
    case REGISTER_FIELD:
      return applyRegisterField(state, action);
    case UNREGISTER_FIELD:
      return applyUnregisterField(state, action);
    case CHANGE_FIELD:
      return applyChangeField(state, action);
    case RESET_FIELD:
      return applyChangeField(state, action);
    case SET_FIELD_VALUE:
      return applySetFieldValue(state, action);
    case SET_DATA:
      return applySetData(state, action);
    case SET_VALID:
      return { ...state, valid: action.payload };
    case RESET:
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
