import ValidatorFactory from '../ValidatorFactory.js';
import minLength from '../common/minLength';
import maxLength from '../common/maxLength';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({
  validators: [
    minLength.extend({min: 5, message: i18n('errors.accountNameLengthMin', 5)}),
    maxLength.extend({max: 45, message: i18n('errors.accountNameLengthMax', 45)})
  ]
});
