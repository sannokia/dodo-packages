import BaseValidator from './BaseValidator';
import _extend from 'lodash/extend';

var ValidatorFactory = {
  create(props) {
    class Validator extends BaseValidator {}

    _extend(Validator.prototype, props);

    return new Validator();
  }
};

export default ValidatorFactory;
