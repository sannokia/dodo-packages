import ValidatorFactory from '../ValidatorFactory';
import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';

const REQUIRED_FIELD_MESSAGE = 'This field is required.';

export default ValidatorFactory.create({
  message: REQUIRED_FIELD_MESSAGE,

  validate(value) {
    if (_isArray(value) || _isString(value)) {
      return !!value.length;
    }

    return !!value;
  }
});
