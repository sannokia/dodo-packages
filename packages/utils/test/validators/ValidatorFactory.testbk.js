var chai = require('chai');

describe('Validators', function() {
  describe('Validator Factory', function() {
    var ValidatorFactory = require('../../lib/validators/ValidatorFactory.js');
    var Validator;

    test('Trivial Validator', function() {
      Validator = ValidatorFactory.create({
        message: 'Default Validator Message',
        validate(value) {
          return value === 'VALID';
        }
      });

      expect(Validator.validate).toBeDefined();
    });

    test('Validate: Success', function() {
      expect(Validator.validate('VALID').valid).toBeTruthy();
    });

    test('Validate: Fail, Default Validator Message', function() {
      var res = Validator.validate('Test');

      expect(res.valid).toBeFalsy();

      expect(res.messageexpect).toEqual('Default Validator Message');
    });

    test('Validate: Fail, Specific Message', function() {
      var res = Validator.validate('Test', 'SPECIFIC INVALID MESSAGE');

      expect(res.valid).toBeFalsy();

      expect(res.message).toEqual('SPECIFIC INVALID MESSAGE');
    });

    test('Validate: Fail, Default Base Message', function() {
      Validator = ValidatorFactory.create({
        validate() {
          return false;
        }
      });
      Validator = Validator.extend({ message: 'This field is invalid.' });

      var res = Validator.validate('Test');

      expect(res.valid).toBeFalsy();

      expect(res.message).toEqual('This field is invalid.');
    });
  });

  describe('Async Validators', function() {
    var AsyncValidator = require('../../lib/validators/AsyncValidator.js');

    var SuccessAsyncValidator = AsyncValidator.extend({
      validate() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5);
        });
      }
    });

    var FailAsyncValidator = AsyncValidator.extend({
      validate() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject('Async validator failed');
          }, 5);
        });
      }
    });

    test('Should succeeed after a specific time interval', function(done) {
      setTimeout(() => {
        SuccessAsyncValidator.validate('test')
          .then(() => {
            done();
          })
          .catch(() => {
            done(new Error('Async validator failed'));
          });
      }, 10);
    });

    test('Should fail after a specific time interval', function(done) {
      setTimeout(() => {
        FailAsyncValidator.validate('test')
          .then(() => {
            done(new Error('Async validator failed'));
          })
          .catch((message) => {
            chai.assert.equal(message, 'Async validator failed');
            done();
          });
      }, 10);
    });
  });

  describe('Email Validator', function() {
    var EmailValidator = require('../../lib/validators/common/email.js');

    test('Should fail on non-email', function() {
      expect(EmailValidator.validate('Test').valid).toBeFalsy();
    });

    test('Should succeed on Email', function() {
      expect.toBeTruthy()(
        EmailValidator.validate('adrian.bonnici@isobar.com').valid
      );
    });
  });

  describe('Number Validator', function() {
    var NumberValidator = require('../../lib/validators/common/number.js');

    test('Should fail on non-Number', function() {
      expect(NumberValidator.validate('Test').valid).toBeFalsy();
    });

    test('Should succeed on Number', function() {
      expect(NumberValidator.validate(15).valid).toBeTruthy();
    });

    test('Should succeed on Number with a Precision of 2 Decimal Points', function() {
      expect(NumberValidator.validate(9.99).valid).toBeTruthy();
    });
  });

  describe('Phone Validator', function() {
    var PhoneValidator = require('../../lib/validators/common/phone.js');

    test('Should fail on non-Phone', function() {
      expect(PhoneValidator.validate('Test').valid).toBeFalsy();
    });

    test('Should succeed on Phone', function() {
      expect(PhoneValidator.validate('(+30) 6986661996').valid).toBeTruthy();
    });
  });

  describe('Symbol Validator', function() {
    var SymbolValidator = require('../../lib/validators/common/symbol.js');

    test('Should fail on non-Symbols', function() {
      expect(SymbolValidator.validate('+ [ ] -').valid).toBeFalsy();
    });

    test('Should succeed on Symbols', function() {
      expect.toBeTruthy()(
        SymbolValidator.validate('This is a valid testing string').valid
      );
    });
  });

  describe('Min value validator', function() {
    var MinValueValidator = require('../../lib/validators/common/minValue.js');

    test('Should fail on value less than 0', function() {
      expect(MinValueValidator.validate('-4').valid).toBeFalsy();
    });

    test('Should succeed on value larger than 0', function() {
      expect(MinValueValidator.validate('5').valid).toBeTruthy();
    });
  });

  describe('Min value extension validator', function() {
    var MinTwoValidator = require('../../lib/validators/common/minTwo.js');

    test('Should succeed on value larger than 2', function() {
      var { valid, message } = MinTwoValidator.validate('5');

      expect(message).toBeNull();
      expect(valid).toBeTruthy();
    });
  });

  describe('ShouldMatch validator', function() {
    var ShouldMatchValidator = require('../../lib/validators/common/shouldMatch.js');

    ShouldMatchValidator.value = 'test12345';

    test('Should fail on different values', function() {
      expect(ShouldMatchValidator.validate('test123456').valid).toBeFalsy();
    });

    test('Should succeed on same values', function() {
      expect(ShouldMatchValidator.validate('test12345').valid).toBeTruthy();
    });
  });
});
