import isDateOfBirth from '../../../testers/date/isDateOfBirth';
import ValidatorFactory from '../../ValidatorFactory';

export default ValidatorFactory.create({
  validate(value) {
    return !isDateOfBirth(value);
  },

  message: 'This is not a valid date.'
});
