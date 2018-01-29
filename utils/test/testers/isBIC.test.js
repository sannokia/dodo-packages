import isBIC from '../../lib/testers/isBIC.js';
import chai from 'chai';

suite('isBIC', () => {

  suite('valid cases', () => {
    test('"AAAABBCCDDD" is a BIC code', () => {
      chai.assert.isTrue(isBIC('AAAABBCCDDD'));
    });

    test('"aazzCGB1" is a BIC code', () => {
      chai.assert.isTrue(isBIC('aazzCGB1'));
    });
  });

  suite('invalid cases', () => {
    test('"AAAA BB CC DDD" is not a BIC code (spaces)', () => {
      chai.assert.isFalse(isBIC('AAAA BB CC DDD'));
    });

    test('"123abc" is not a BIC code', () => {
      chai.assert.isFalse(isBIC('123abc'));
    });
  });

});
