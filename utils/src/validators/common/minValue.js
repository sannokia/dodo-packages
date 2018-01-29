import isNumeric from '../../testers/isNumeric';
import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  min: 0,

  message() {
    return i18n('errors.minValue', this.min);
  },

  validate(value) {
    value = String(value).replace(/,/g, '');
    return isNumeric(value) && this.min <= +value;
  }

});
