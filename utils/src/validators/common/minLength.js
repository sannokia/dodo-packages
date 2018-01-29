import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  min: 0,

  message() {
    return i18n('errors.minLength', this.min);
  },

  validate(value) {
    return value ? value.length > this.min : true;
  }

});
