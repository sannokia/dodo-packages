import isEmail from '../../testers/isEmail';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isEmail(value);
  }

});
