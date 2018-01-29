import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';
import maxLength from '../common/maxLength';

export default ValidatorFactory.create({
  validators: [
    maxLength.extend({max: 255, message: i18n('errors.invalidPaymentMessage')})
  ]
});
