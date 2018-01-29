import isClaimCode from '../../lib/testers/isClaimCode.js';
import chai from 'chai';

suite('isClaimCode', () => {

  suite('valid cases', () => {
    test('"01ab-az03-2050" is a Claim Code', () => {
      chai.assert.isTrue(isClaimCode('01ab-az03-2050'));
    });

    test('"asDf-1020-slsd" is a Claim Code', () => {
      chai.assert.isTrue(isClaimCode('asDf-1020-slsd'));
    });
  });

  suite('invalid cases', () => {
    test('"asdfe-1232-1laf" is not a Claim Code', () => {
      chai.assert.isFalse(isClaimCode('asdfe-1232-1laf'));
    });

    test('"123a-asdfls" is not a Claim Code', () => {
      chai.assert.isFalse(isClaimCode('123a-asdfls'));
    });
  });

});
