import chai from 'chai';
import date from '../../lib/formatters/toDate.js';

suite('date', () => {

  test('valid format', () => {
    var res = date('2014-11-15', 'YYYY-MM-DD');
    chai.assert.equal(res, '15.11.14', 'Format should be DD.MM.YY');
  });

  test('invalid format', () => {
    var res = date('2014.11.15');
    chai.assert.equal(res, '15.11.14', 'Format should be DD.MM.YY');
  });

});
