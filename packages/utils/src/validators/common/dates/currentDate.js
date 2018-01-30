import isCurrentDate from '../../../testers/date/isCurrentDate';
import ValidatorFactory from '../../ValidatorFactory';

export default ValidatorFactory.create({
  validate(value) {
    return !isCurrentDate(value);
  },

  message: 'This is not a valid date.'
});
