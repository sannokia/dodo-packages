import _isString from 'lodash/isString';
import _includes from 'lodash/includes';

export default function(val) {
  var truey = ['yes', 'true'];

  var falsy = ['no', 'false'];

  if (_isString(val)) {
    val = val.toLowerCase();

    if (_includes(truey, val) || _includes(falsy, val)) {
      return true;
    }
  }

  return false;
}
