import chai from 'chai';
import toMoney from '../../lib/formatters/toMoney.js';

suite('toMoney', () => {

  test('1234 gives valid object back', () => {
    var availableBalance = 1234;
    var currencyId = 1;
    var res = toMoney(availableBalance, currencyId)
    chai.assert.equal(res.value, 1234);
    chai.assert.equal(res.string, '1234.00');
    chai.assert.equal(res.fullString, '1&nbsp;1,234.00');
    chai.assert.equal(res.polarity, 'positive');
  });

  test('-1234 gives valid object back', () => {
    var availableBalance = -1234;
    var currencyId = 1;
    var res = toMoney(availableBalance, currencyId)
    chai.assert.equal(res.value, -1234);
    chai.assert.equal(res.string, '-1234.00');
    chai.assert.equal(res.fullString, '1&nbsp;1,234.00');
    chai.assert.equal(res.polarity, 'negative');
  });
});
