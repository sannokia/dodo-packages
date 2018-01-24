var isRegexp = require('is-regexp');
var isPlainObj = require('is-plain-obj');

module.exports = function(val, opts) {
  var seen = [];

  var levelColors = opts.colors;

  return (function stringify(val, opts, isKey) {

    var color = isKey ? levelColors.properties : levelColors.values;

    opts = opts || {};

    if (val === null || val === undefined || typeof val === 'number' || typeof val === 'boolean' || typeof val === 'function' || isRegexp(val)) {
      return color(String(val));
    }

    if (val instanceof Date) {
      return 'new Date("' + val.toISOString() + '")';
    }

    if (Array.isArray(val)) {
      if (val.length === 0) {
        return levelColors.braces('[]');
      }

      return '[' + val.map(function(el, i) {
        var eol = val.length - 1 === i ? '' : ',';
        return stringify(el, opts) + eol;
      }).join('') + ']';
    }

    if (isPlainObj(val)) {
      if (seen.indexOf(val) !== -1) {
        return '"[Circular]"';
      }

      var objKeys = Object.keys(val);

      if (objKeys.length === 0) {
        return levelColors.braces('{}');
      }

      seen.push(val);

      var ret = levelColors.braces('{') + objKeys.map(function(el, i) {
        if (opts.filter && !opts.filter(val, el)) {
          return '';
        }

        var eol = objKeys.length - 1 === i ? '' : ',';
        var key = stringify(el, opts, true);

        if (el === 'body') {
          return levelColors.properties(key) + ':' + levelColors.body(stringify(val[el], opts)) + eol;
        }

        return levelColors.properties(key) + ':' + stringify(val[el], opts) + eol;
      }).join('') + levelColors.braces('}');

      seen.pop(val);

      return ret;
    }

    val = String(val).replace(/[\r\n]/g, function(x) {
      return x === '\n' ? '\\n' : '\\r';
    });

    return color('"' + val.replace(/"/g, '\\\"') + '"');

  })(val, opts);
};
