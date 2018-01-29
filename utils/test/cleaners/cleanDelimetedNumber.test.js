var number = require('../../lib/cleaners/cleanDelimetedNumber.js');
var chai = require('chai');

suite('number', function() {

  test('falsly values should be returned as is', function() {
    chai.assert.equal(number(false), false);
    chai.assert.equal(number(undefined), undefined);
    chai.assert.equal(number(null), null);
    chai.assert.equal(number(0), 0);
  });

  test('"123" should be returned as is', function() {
    chai.assert.equal(number('123'), '123');
  });

  test('"123,999" should be returned as "123999"', function() {
    chai.assert.equal(number('123,999'), '123999');
  });
});
