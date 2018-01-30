import ValidatorFactory from '../ValidatorFactory';

export default ValidatorFactory.create({
  value: null,

  validate(value) {
    return value !== this.value;
  }
});
