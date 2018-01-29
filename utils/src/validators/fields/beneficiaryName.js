import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';
import minLength from '../common/minLength';
import maxLength from '../common/maxLength';

var min = 4;
var max = 70;

export default ValidatorFactory.create({
  validators: [
    minLength.extend({min , message: i18n('errors.beneficiaryNameMinLength', min)}),
    maxLength.extend({max , message: i18n('errors.beneficiaryNameMaxLength', max)})
  ]
});
