import isDefaultDate from '../../../testers/date/isDefaultDate';
import ValidatorFactory from '../../ValidatorFactory.js';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  validate(value) {
    return !isDefaultDate(value);
  },

  message: i18n('errors.invalidDate')

});
