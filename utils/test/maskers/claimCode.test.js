// import chai from 'chai';
import ClaimCode from '../../lib/maskers/claimCode.js';

suite('claimCode', () => {

  // suiteSetup(() => {
  //   this.ClaimCode = new ClaimCode();
  // });

  test('valid format', () => {
    var c = ClaimCode.mask('123', '12');
    console.log('c:', c);
    // chai.assert.equal(res, '15.11.14', 'Format should be DD.MM.YY');
  });

});
