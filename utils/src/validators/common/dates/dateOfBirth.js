import isDateOfBirth from '../../../testers/date/isDateOfBirth';
import ValidatorFactory from '../../ValidatorFactory.js';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  validate(value) {
    return !isDateOfBirth(value);
  },

  message: i18n('errors.invalidDate')

});
