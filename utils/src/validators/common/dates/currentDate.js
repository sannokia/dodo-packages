import isCurrentDate from '../../../testers/date/isCurrentDate';
import ValidatorFactory from '../../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  validate(value) {
    return !isCurrentDate(value);
  },

  message: i18n('errors.invalidDate')

});
