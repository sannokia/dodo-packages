import nipName from '../../testers/isNipName';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return nipName(value);
  }

});
