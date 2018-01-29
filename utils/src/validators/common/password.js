import ValidatorFactory from '../ValidatorFactory';
import hasChars from './hasChars';
import hasNumbers from './hasNumbers';
import minLength from './minLength';
import maxLength from './maxLength';
import required from './required';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({
  validators: [
    required,
    hasChars.extend({message: i18n('errors.invalidPasswordContainCharacters')}),
    hasNumbers.extend({message: i18n('errors.invalidPasswordContainNumbers')}),
    minLength.extend({min: 8, message: i18n('errors.invalidPasswordMinValue', 8)}),
    maxLength.extend({max: 45, message: i18n('errors.invalidPasswordMaxValue', 45)})
  ]
});
