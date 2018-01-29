import isFutureOrCurrentDate from '../../../testers/date/isFutureOrCurrentDate';
import ValidatorFactory from '../../ValidatorFactory.js';
import i18n from '@nemea/i18n-lib';
import moment from 'moment';

export default ValidatorFactory.create({

  validate(value) {
    return !isFutureOrCurrentDate(moment(value));
  },

  message: i18n('errors.invalidFutureDate')

});
