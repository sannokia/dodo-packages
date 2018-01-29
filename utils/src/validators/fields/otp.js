import ValidatorFactory from '../ValidatorFactory';
import isOTP from '../../testers/isOTP';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  message() {
    return i18n('authorisation.otpInvalid');
  },

  validate(value) {
    if (!value) {
      return false;
    }

    return isOTP(value);
  }

});
