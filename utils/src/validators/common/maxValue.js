import isNumeric from '../../testers/isNumeric';
import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  max: 0,

  message() {
    return i18n('errors.maxValue', this.max);
  },

  validate(value) {
    value = String(value).replace(/,/g, '');
    return isNumeric(value) && this.max >= +value;
  }

});
