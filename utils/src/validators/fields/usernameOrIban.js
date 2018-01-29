import isNemeaIban from '../../testers/isNemeaIBAN';
import isNemeaUsername from '../../testers/isNemeaUsername';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return value && (isNemeaUsername(value) || isNemeaIban(value));
  }

});
