import isEmail from '../../lib/testers/isEmail';

describe('isEmail', () => {
  describe('valid cases', () => {
    test('"adrian.bonnici@isobar.com" is an email', () => {
      expect(isEmail('adrian.bonnici@isobar.com')).toBeTruthy();
    });

    test('"what@gmail.com" is an email', () => {
      expect(isEmail('what@gmail.com')).toBeTruthy();
    });
  });

  describe('invalid cases', () => {
    test('"asdfasdf.com" is not an email', () => {
      expect(isEmail('asdfasdf.com')).toBeFalsy();
    });

    test('"<hello>@<world>.com" is not an email', () => {
      expect(isEmail('<hello>@<world>.com')).toBeFalsy();
    });
  });
});
