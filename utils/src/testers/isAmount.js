import isNumeric from './isNumeric';
import cleanDelimetedNumber from '../cleaners/cleanDelimetedNumber';

export default function(value) {
  value = cleanDelimetedNumber(value);
  return isNumeric(value) && value > 0;
}
