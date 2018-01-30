import isEmail from '../../lib/testers/isEmail';
import chai from 'chai';

suite('isEmail', () => {
  suite('valid cases', () => {
    test('"adrian.bonnici@isobar.com" is an email', () => {
      chai.assert.isTrue(isEmail('adrian.bonnici@isobar.com'));
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
