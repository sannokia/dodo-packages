import i18n from 'i18n';
import dashToCamel from '../string/dashToCamel';
import _extend from 'lodash/extend';
import _each from 'lodash/each';
import _has from 'lodash/has';
import _get from 'lodash/get';

var defaults = {
  i18n: false
};

export default function(items, obj, options) {

  options = _extend({}, defaults, options);

  var components = [];

  /*eslint max-statements:0*/
  _each(items, (mapper, key) => {

    if (!mapper) {
      return;
    }

    var value;

    // Check if explicitly set value
    if (_has(mapper, 'value')) {
      value = mapper.value;
    } else {
      // Check if whitelisted item is in object
      if (!_has(obj, key) || obj[key] === null || obj[key] === '') {
        return;
      } else {
        value = _get(obj, key);
      }
    }

    var formatter = mapper;
    var label;

    if (typeof mapper !== 'function' && mapper !== null) {
      // Assume object like: { label: '', formatter: null }
      formatter = mapper.formatter;
      label = mapper.label;
    }

    if (typeof label === 'function') {
      label = label();
    } else if (options.i18n) {
      label = i18n(dashToCamel(key || label));
    }

    if (typeof formatter === 'function') {
      value = formatter(value);
    }

    if (value === null || value === '' || typeof value === 'undefined') {
      return;
    }

    components.push({
      key,
      label,
      value
    });

  });

  return components;

}
