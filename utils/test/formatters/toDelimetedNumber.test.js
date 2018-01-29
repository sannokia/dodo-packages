import chai from 'chai';
import toDelimetedNumber from '../../lib/formatters/toDelimetedNumber.js';

suite('toDelimetedNumber', () => {

  test('default separator', () => {
    var res = toDelimetedNumber(123123456456);
    chai.assert.equal(res, '123,123,456,456');
  });

  test('- as separator', () => {
    var res = toDelimetedNumber(123123456456, '-');
    chai.assert.equal(res, '123-123-456-456');
  });

});
