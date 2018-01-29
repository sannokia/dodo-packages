var cleanSpaces = require('../../lib/cleaners/cleanSpaces.js');
var chai = require('chai');

suite('cleanSpaces', function() {

  test('falsly values should return undefined', function() {
    chai.assert.equal(cleanSpaces(false), undefined);
    chai.assert.equal(cleanSpaces(undefined), undefined);
    chai.assert.equal(cleanSpaces(null), undefined);
    chai.assert.equal(cleanSpaces(0), undefined);
  });

  test('"123" should be returned as is', function() {
    chai.assert.equal(cleanSpaces('123'), '123');
  });

  test('"there be spaces" should be returned as "therebespaces"', function() {
    chai.assert.equal(cleanSpaces('there be spaces'), 'therebespaces');
  });
});
