import chai from 'chai';
import toBoolean from '../../lib/formatters/toBoolean.js';

suite('toBoolean', () => {

  test('"yes" is true', () => {
    var res = toBoolean('yes');
    chai.assert.isTrue(res);
  });

  test('"true" is true', () => {
    var res = toBoolean('true');
    chai.assert.isTrue(res);
  });

  test('"no" is false', () => {
    var res = toBoolean('no');
    chai.assert.isFalse(res);
  });

  test('"false" is false', () => {
    var res = toBoolean('false');
    chai.assert.isFalse(res);
  });

  test('false is false', () => {
    var res = toBoolean(false);
    chai.assert.isFalse(res);
  });

  test('true is true', () => {
    var res = toBoolean(true);
    chai.assert.isTrue(res);
  });

  test('123 is true', () => {
    var res = toBoolean(123);
    chai.assert.isTrue(res);
  });

  test('undefined is false', () => {
    var res = toBoolean(undefined);
    chai.assert.isFalse(res);
  });
});
