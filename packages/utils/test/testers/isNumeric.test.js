import isNumeric from '../../lib/testers/isNumeric';

describe('isNumeric', function() {
  test('123 is numeric', function() {
    expect(isNumeric(123)).toBeTruthy();
  });

  test('"123" is numeric', function() {
    expect(isNumeric('123')).toBeTruthy();
  });

  test('123.12 is numeric', function() {
    expect(isNumeric(123.12)).toBeTruthy();
  });

  test('"123a" is not numeric', function() {
    expect(isNumeric('123a')).toBeFalsy();
  });

  test('{} is not numeric', function() {
    expect(isNumeric({})).toBeFalsy();
  });

  test('[1, 2] is not numeric', function() {
    expect(isNumeric([1, 2])).toBeFalsy();
  });
});
