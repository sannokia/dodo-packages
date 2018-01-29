import isEmail from '../../lib/testers/isEmail.js';
import chai from 'chai';

suite('isEmail', () => {

  suite('valid cases', () => {
    test('"justin.calleja@nemeabank.com" is an email', () => {
      chai.assert.isTrue(isEmail('justin.calleja@nemeabank.com'));
    });

    test('"what@gmail.com" is an email', () => {
      chai.assert.isTrue(isEmail('what@gmail.com'));
    });
  });

  suite('invalid cases', () => {
    test('"asdfasdf.com" is not an email', () => {
      chai.assert.isFalse(isEmail('asdfasdf.com'));
    });

    test('"<hello>@<world>.com" is not an email', () => {
      chai.assert.isFalse(isEmail('<hello>@<world>.com'));
    });
  });

});
