var Zeus = require('../lib');
var chai = require('chai');

var dict = {
  _prefix: 'rest/test',

  test: {
    list: {
      _method: 'get',
      _subpath: 'test-path'
    }
  }
};

suite('Function list', function() {
  var zeus;

  suiteSetup('Create Zeus instance', function() {
    zeus = new Zeus({
      api: 'http://example.com',
      dict
    });
  });

  suite('#length', function() {
    test('should not be zero', function() {
      chai.assert.notEqual(0, zeus.list().length);
    });
  });
});
