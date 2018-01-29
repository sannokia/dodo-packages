import isSymbol from '../../testers/isSymbol';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isSymbol(value);
  }

});
