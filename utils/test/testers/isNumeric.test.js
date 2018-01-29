import isNumeric from '../../lib/testers/isNumeric.js';
import chai from 'chai';

suite('isNumeric', function() {

  test('123 is numeric', function() {
    chai.assert.isTrue(isNumeric(123));
  });

  test('"123" is numeric', function() {
    chai.assert.isTrue(isNumeric('123'));
  });

  test('123.12 is numeric', function() {
    chai.assert.isTrue(isNumeric(123.12));
  });

  test('"123a" is not numeric', function() {
    chai.assert.isFalse(isNumeric('123a'));
  });

  test('{} is not numeric', function() {
    chai.assert.isFalse(isNumeric({}));
  });

  test('[1, 2] is not numeric', function() {
    chai.assert.isFalse(isNumeric([1, 2]));
  });
});
