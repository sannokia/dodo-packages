import isClaimCode from '../../testers/isClaimCode';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isClaimCode(value);
  }

});
