import chai from 'chai';
import toPrettyMonths from '../../lib/formatters/toPrettyMonths.js';

suite('toPrettyMonths', () => {

  test('1 month', () => {
    var res = toPrettyMonths(1);
    chai.assert.equal(res, '1 month');
  });

  test('2 months', () => {
    var res = toPrettyMonths(2);
    chai.assert.equal(res, '2 months');
  });

  test('3 months', () => {
    var res = toPrettyMonths(3);
    chai.assert.equal(res, '3 months');
  });

  test('123 months', () => {
    var res = toPrettyMonths(123);
    chai.assert.equal(res, '123 months');
  });
});
