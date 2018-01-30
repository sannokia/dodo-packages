import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  min: 0,

  message() {
    return `Length should be less than ${this.min}.`;
  },

  validate(value) {
    return value ? value.length > this.min : true;
  }
});
