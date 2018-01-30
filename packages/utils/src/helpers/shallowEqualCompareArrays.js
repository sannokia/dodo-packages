import shallowEqual from './shallowEqual';

var shallowEqualCompareArrays = function(objA, objB) {
  return shallowEqual(objA, objB, true);
};

export default shallowEqualCompareArrays;
