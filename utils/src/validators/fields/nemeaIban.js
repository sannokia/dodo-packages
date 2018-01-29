import isNemeaIban from '../../testers/isNemeaIBAN';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isNemeaIban(value);
  }

});
