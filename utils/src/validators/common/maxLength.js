import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  max: 0,

  message() {
    return i18n('errors.maxLength', this.max);
  },

  validate(value) {
    return value ? value.length <= this.max : true;
  }

});
