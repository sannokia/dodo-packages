import isAmount from '../../testers/isAmount';
import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  validate(value) {
    return isAmount(value);
  },

  message: i18n('errors.invalidAmount')

});
