import isAmount from '../../lib/testers/isAmount.js';
var chai = require('chai');

suite('isAmount', () => {

  test('"123,123" is an amount', () => {
    chai.assert.isTrue(isAmount('123,123'));
  });

  test('123123 is an isAmount', () => {
    chai.assert.isTrue(isAmount(123123));
  });

  test('"123abc" is not an isAmount', () => {
    chai.assert.isFalse(isAmount('123abc'));
  });
});
