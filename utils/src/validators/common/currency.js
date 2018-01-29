import isCurrency from '../../testers/isCurrency';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({

  validate(value) {
    return isCurrency(value);
  }

});
