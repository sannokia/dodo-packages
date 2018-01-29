export default function(fn) {
  var map = {};

  var memoized = function() {
    var args = JSON.stringify(arguments);

    if (map.hasOwnProperty(args)) {
      return map[args];
    }

    map[args] = fn.apply(this, arguments);

    return map[args];
  };

  memoized.__CACHE = map;

  return memoized;
}
