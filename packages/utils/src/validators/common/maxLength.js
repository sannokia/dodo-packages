import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  max: 0,

  message() {
    return `Length should not be greater than ${this.max}.`;
  },

  validate(value) {
    return value ? value.length <= this.max : true;
  }
});
