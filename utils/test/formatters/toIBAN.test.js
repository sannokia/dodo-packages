import chai from 'chai';
import ibanFormatter from '../../lib/formatters/toIBAN.js';

suite('iban', () => {

  test('valid iban format', () => {
    var res = ibanFormatter('AL47212110090000000235698741');
    chai.assert.equal(res, 'AL47 2121 1009 0000 0002 3569 8741');
  });

  test('invalid iban format passes anyway', () => {
    var res = ibanFormatter('12A');
    chai.assert.equal(res, '12A');
  });

});
