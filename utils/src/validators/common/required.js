import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';
import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';

export default ValidatorFactory.create({

  message: i18n('errors.required'),

  validate(value) {
    if (_isArray(value) || _isString(value)) {
      return !!value.length;
    }

    return !!value;
  }

});
