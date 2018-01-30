import isDefaultDate from '../../../testers/date/isDefaultDate';
import ValidatorFactory from '../../ValidatorFactory';

export default ValidatorFactory.create({
  validate(value) {
    return !isDefaultDate(value);
  },

  message: 'This is not a valid date.'
});
