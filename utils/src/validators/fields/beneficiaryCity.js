import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';
import maxLength from '../common/maxLength';

var max = 45;

export default ValidatorFactory.create({
  validators: [
    maxLength.extend({max , message: i18n('errors.beneficiaryCityMaxLength', max)})
  ]
});
