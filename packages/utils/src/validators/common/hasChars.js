import hasChars from '../../testers/hasChars';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  message: 'Value should contain characters.',
  validate: hasChars
});
