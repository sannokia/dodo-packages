import hasChars from '../../testers/hasChars';
import ValidatorFactory from '../ValidatorFactory.js';
import i18n from '@nemea/i18n-lib';

export default ValidatorFactory.create({

  message: i18n('errors.containChars'),
  validate: hasChars

});
