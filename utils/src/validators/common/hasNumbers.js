import hasNumbers from '../../testers/hasNumbers';
import ValidatorFactory from '../ValidatorFactory';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  message: i18n('errors.containChars'),
  validate: hasNumbers

});
