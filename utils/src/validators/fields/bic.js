import isBic from '../../testers/isBIC';
import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  message: i18n('errors.invalidBIC'),

  validate(value) {

    if (!value) {
      return false;
    }

    return isBic(value);
  }

});
