import isNumeric from '../../testers/isNumeric';
import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  min: 0,

  message() {
    return `Value should be larger than ${this.min}`;
  },

  validate(value) {
    value = String(value).replace(/,/g, '');
    return isNumeric(value) && this.min <= +value;
  }
});
