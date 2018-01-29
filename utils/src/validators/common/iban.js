import isIban from '../../testers/isIBAN';
import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  message: i18n('errors.invalidIban'),

  validate(value) {

    if (!value) {
      return false;
    }

    return isIban(value);
  }

});
