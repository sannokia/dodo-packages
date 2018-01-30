import isNumber from '../../testers/isNumber';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  validate(value) {
    return isNumber(value);
  }
});
