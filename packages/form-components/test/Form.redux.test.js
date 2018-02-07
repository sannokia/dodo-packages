import _keys from 'lodash/keys';
import _first from 'lodash/first';
import _values from 'lodash/values';
import {
  default as reducer,
  initialState,
  actionCreators as formActionCreators
} from '../src/middleware';
import formActionTypes from '../src/middleware/actionTypes';

var initialValues = {
  'input-1': 'input-1'
};

var getInitialInputName = () => {
  return _first(_keys(initialValues));
};

var getInitialInputValue = () => {
  return _first(_values(initialValues));
};

var getInitialInputMeta = () => {
  return {
    pristine: false,
    touched: false,
    valid: true,
    error: null
  };
};

suite('Form Middlware Action Creators', function() {
  var formKey = _.uniqueId('form_');
  var inputName = getInitialInputName();
  var inputValue = getInitialInputValue();
  var inputMeta = getInitialInputMeta();

  var getState = (data) => {
    var defaultState = {
      [formKey]: {
        ...initialState,
        ...data
      }
    };

    return defaultState;
  };

  test('.doMount returns an object with the type of form/MOUNT', function() {
    chai.assert.deepEqual(formActionCreators.doMount(formKey), {
      type: formActionTypes.MOUNT,
      meta: {
        form: formKey
      }
    });
  });

  test('.doDestroy returns an object with the type of form/DESTROY', function() {
    chai.assert.deepEqual(formActionCreators.doDestroy(formKey), {
      type: formActionTypes.DESTROY,
      meta: {
        form: formKey
      }
    });
  });

  test('.doSetInitialValues returns an object with the type of form/SET_INITIAL_VALUES', function() {
    chai.assert.deepEqual(
      formActionCreators.doSetInitialValues(formKey, initialValues),
      {
        type: formActionTypes.SET_INITIAL_VALUES,
        meta: {
          form: formKey
        },
        payload: {
          data: initialValues
        }
      }
    );
  });

  test('.doResetField returns an object with the type of form/RESET_FIELD', function() {
    let name = 'input-1';
    let value = 'input-2';
    let meta = {
      pristine: true,
      valid: true,
      error: null
    };

    chai.assert.deepEqual(
      formActionCreators.doResetField(formKey, name, value, meta),
      {
        type: formActionTypes.RESET_FIELD,
        meta: {
          form: formKey
        },
        payload: {
          name,
          value,
          meta
        }
      }
    );
  });

  test('.doRegisterField returns an object with the type of form/REGISTER_FIELD', function() {
    let name = 'input-1';
    let value = 'input-2';
    let meta = {
      pristine: true,
      valid: true,
      error: null
    };

    chai.assert.deepEqual(
      formActionCreators.doRegisterField(formKey, name, value, meta),
      {
        type: formActionTypes.REGISTER_FIELD,
        meta: {
          form: formKey
        },
        payload: {
          name,
          value,
          meta
        }
      }
    );
  });

  test('.doUnregisterField returns an object with the type of form/UNREGISTER_FIELD', function() {
    let name = 'input-1';

    chai.assert.deepEqual(formActionCreators.doUnregisterField(formKey, name), {
      type: formActionTypes.UNREGISTER_FIELD,
      meta: {
        form: formKey
      },
      payload: {
        name
      }
    });
  });

  test('.doSetValid returns an object with the type of form/SET_VALID', function() {
    let valid = false;

    chai.assert.deepEqual(formActionCreators.doSetValid(formKey, valid), {
      type: formActionTypes.SET_VALID,
      meta: {
        form: formKey
      },
      payload: valid
    });
  });

  test('.doReset returns an object with the type of form/RESET', function() {
    let valid = false;

    chai.assert.deepEqual(formActionCreators.doReset(formKey, valid), {
      type: formActionTypes.RESET,
      meta: {
        form: formKey
      }
    });
  });

  test('on form/MOUNT action', function() {
    chai.assert.deepEqual(
      reducer(getState(), {
        type: formActionTypes.MOUNT,
        meta: { form: formKey }
      }),
      {
        [formKey]: { ...initialState, isMounted: true }
      }
    );
  });

  test('on form/SET_INITIAL_VALUES action', function() {
    chai.assert.deepEqual(
      reducer(getState({ isMounted: true }), {
        type: formActionTypes.SET_INITIAL_VALUES,
        meta: { form: formKey },
        payload: { data: initialValues }
      }),
      {
        [formKey]: { ...initialState, initialValues, isMounted: true }
      }
    );
  });

  test('on form/DESTROY action', function() {
    chai.assert.deepEqual(
      reducer(getState({ isMounted: true }), {
        type: formActionTypes.DESTROY,
        meta: { form: formKey }
      }),
      {
        [formKey]: { ...initialState }
      }
    );
  });

  test('on form/RESET_FIELD action', function() {
    var payload = {
      name: inputName,
      value: inputValue,
      meta: {
        ...inputMeta,
        pristine: true
      }
    };

    chai.assert.deepEqual(
      reducer(
        getState({
          isMounted: true,
          initialValues,
          components: {
            [inputName]: { name: inputName, meta: inputMeta }
          },
          values: { [inputName]: inputValue }
        }),
        { type: formActionTypes.RESET_FIELD, meta: { form: formKey }, payload }
      ),
      {
        [formKey]: {
          ...initialState,
          isMounted: true,
          initialValues,
          values: { [inputName]: payload.value },
          components: {
            [inputName]: { name: payload.name, meta: payload.meta }
          }
        }
      }
    );
  });

  test('on form/REGISTER_FIELD action', function() {
    chai.assert.deepEqual(
      reducer(getState({ isMounted: true }), {
        type: formActionTypes.REGISTER_FIELD,
        meta: { form: formKey },
        payload: { name: inputName, value: inputValue, meta: inputMeta }
      }),
      {
        [formKey]: {
          ...initialState,
          isMounted: true,
          values: { [inputName]: inputValue },
          components: { [inputName]: { name: inputName, meta: inputMeta } }
        }
      }
    );
  });

  test('on form/UNREGISTER_FIELD action', function() {
    chai.assert.deepEqual(
      reducer(
        getState({
          isMounted: true,
          components: {
            [inputName]: { name: inputName, meta: inputMeta }
          },
          values: { [inputName]: inputValue }
        }),
        {
          type: formActionTypes.UNREGISTER_FIELD,
          meta: { form: formKey },
          payload: { name: inputName }
        }
      ),
      {
        [formKey]: { ...initialState, isMounted: true }
      }
    );
  });

  test('on form/SET_FIELD_VALUE action', function() {
    var payload = {
      name: inputName,
      value: 'input-1-new-value',
      meta: {
        ...inputMeta,
        pristine: false
      }
    };

    chai.assert.deepEqual(
      reducer(
        getState({
          isMounted: true,
          components: {
            [inputName]: { name: inputName, meta: inputMeta }
          },
          values: { [inputName]: inputValue }
        }),
        {
          type: formActionTypes.SET_FIELD_VALUE,
          meta: { form: formKey },
          payload
        }
      ),
      {
        [formKey]: {
          ...initialState,
          isMounted: true,
          components: {
            [inputName]: { name: inputName, meta: inputMeta }
          },
          values: { [inputName]: payload.value }
        }
      }
    );
  });

  test('on form/CHANGE_FIELD action', function() {
    var payload = {
      name: inputName,
      value: 'input-1-new-value',
      meta: {
        ...inputMeta,
        pristine: false
      }
    };

    chai.assert.deepEqual(
      reducer(
        getState({
          isMounted: true,
          components: {
            [inputName]: { name: inputName, meta: inputMeta }
          },
          values: { [inputName]: inputValue }
        }),
        { type: formActionTypes.CHANGE_FIELD, meta: { form: formKey }, payload }
      ),
      {
        [formKey]: {
          ...initialState,
          isMounted: true,
          values: { [inputName]: payload.value },
          components: { [inputName]: { name: inputName, meta: payload.meta } }
        }
      }
    );
  });

  test('on form/SET_VALID action', function() {
    chai.assert.deepEqual(
      reducer(getState({ isMounted: true }), {
        type: formActionTypes.SET_VALID,
        meta: { form: formKey },
        payload: false
      }),
      {
        [formKey]: { ...initialState, isMounted: true, valid: false }
      }
    );
  });

  test('on form/RESET action', function() {
    chai.assert.deepEqual(
      reducer(
        getState({
          isMounted: true,
          initialValues,
          components: {
            [inputName]: { name: inputName, meta: inputMeta }
          },
          values: { [inputName]: inputValue }
        }),
        { type: formActionTypes.RESET, meta: { form: formKey } }
      ),
      {
        [formKey]: {
          ...initialState,
          isMounted: true,
          initialValues,
          values: { [inputName]: inputValue },
          components: {
            [inputName]: {
              name: inputName,
              meta: { pristine: true, touched: false }
            }
          }
        }
      }
    );
  });
});
