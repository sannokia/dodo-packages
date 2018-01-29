import isPhone from '../../testers/isPhone';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isPhone(value);
  }

});
