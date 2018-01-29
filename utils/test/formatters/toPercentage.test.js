import chai from 'chai';
import toPercentage from '../../lib/formatters/toPercentage.js';

suite('toPercentage', () => {

  test('1234 gives valid object back', () => {
    var res = toPercentage(30);
    chai.assert.equal(res, '30.00%');
  });

  test('-1234 gives valid object back', () => {
    var res = toPercentage(-30);
    chai.assert.equal(res, '-30.00%');
  });
});
