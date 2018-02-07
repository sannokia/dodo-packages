var Zeus = require('../lib');

var dict = {
  _prefix: 'rest/test',

  test: {
    list: {
      _method: 'get',
      _subpath: 'test-path'
    }
  }
};

describe('Function list', function() {
  var zeus = new Zeus({
    api: 'http://example.com',
    dict
  });

  describe('#length', function() {
    test('should not be zero', function() {
      expect(zeus.list().length).not.toEqual(0);
    });
  });
});
