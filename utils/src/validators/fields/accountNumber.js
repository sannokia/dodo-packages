import isAccountNumber from '../../testers/isAccountNumber';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isAccountNumber(value);
  }

});
