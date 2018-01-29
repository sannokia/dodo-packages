var _isArray = require('lodash/isArray');

var shallowEqual = function(objA, objB, shouldCompareArrays = false) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {

    if (shouldCompareArrays && _isArray(objA[keysA[i]])) {
      if (_isArray(objB[keysA[i]])) {
        if (!shallowEqual(objA[keysA[i]], objB[keysA[i]], false)) {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }
  }

  return true;
};

export default shallowEqual;
