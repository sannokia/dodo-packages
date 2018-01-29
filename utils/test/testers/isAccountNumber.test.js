import isAccountNumber from '../../lib/testers/isAccountNumber.js';
var chai = require('chai');

suite('isAccountNumber', function() {

  test('length less than 4 should fail', function() {
    chai.assert.isFalse(isAccountNumber('123'));
  });

  test('length more than 20 should fail', function() {
    chai.assert.isFalse(isAccountNumber('123456789012345678901'));
  });

  test('length less than 21 and more than 3 should pass', function() {
    chai.assert.isTrue(isAccountNumber('1234'));
  });
});
