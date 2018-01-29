import chai from 'chai';
import toTimeUnitWord from '../../lib/formatters/toTimeUnitWord.js';

suite('toTimeUnitWord', () => {

  test('minutes', () => {
    var res = toTimeUnitWord('minutes', 2);
    chai.assert.equal(res, 'minutes');
  });

  test('minute', () => {
    var res = toTimeUnitWord('minute', 1);
    chai.assert.equal(res, 'minute');
  });

});
