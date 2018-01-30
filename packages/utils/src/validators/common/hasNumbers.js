import hasNumbers from '../../testers/hasNumbers';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  message: 'Value should contain numbers.',
  validate: hasNumbers
});
