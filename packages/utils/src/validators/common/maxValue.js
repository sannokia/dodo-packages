import isNumeric from '../../testers/isNumeric';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  max: 0,

  message() {
    return `Value should not be larger than ${this.max}`;
  },

  validate(value) {
    value = String(value).replace(/,/g, '');
    return isNumeric(value) && this.max >= +value;
  }
});
