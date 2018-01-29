import chai from 'chai';
import toYesNo from '../../lib/formatters/toYesNo.js';

suite('toYesNo', () => {

  test('true is yes', () => {
    var res = toYesNo(true);
    chai.assert.equal(res, 'yes');
  });

  test('false is no', () => {
    var res = toYesNo(false);
    chai.assert.equal(res, 'no');
  });

  test('undefined is undefined', () => {
    var res = toYesNo(undefined);
    chai.assert.equal(res, undefined);
  });

  test('123 is undefined', () => {
    var res = toYesNo(123);
    chai.assert.equal(res, undefined);
  });

});
