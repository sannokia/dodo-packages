var chai = require('chai');

suite('Validators', function() {
  suite('Validator Factory', function() {
    var ValidatorFactory = require('../../lib/validators/ValidatorFactory.js');
    var Validator;

    test('Trivial Validator', function() {
      Validator = ValidatorFactory.create({
        message: 'Default Validator Message',
        validate(value) {
          return value === 'VALID';
        }
      });

      chai.assert.isDefined(Validator.validate);
    });

    test('Validate: Success', function() {
      chai.assert.isTrue(Validator.validate('VALID').valid);
    });

    test('Validate: Fail, Default Validator Message', function() {
      var res = Validator.validate('Test');

      chai.assert.isFalse(res.valid);

      chai.assert.equal(res.message, 'Default Validator Message');
    });

    test('Validate: Fail, Specific Message', function() {
      var res = Validator.validate('Test', 'SPECIFIC INVALID MESSAGE');

      chai.assert.isFalse(res.valid);

      chai.assert.equal(res.message, 'SPECIFIC INVALID MESSAGE');
    });

    test('Validate: Fail, Default Base Message', function() {
      Validator = ValidatorFactory.create({
        validate() {
          return false;
        }
      });
      Validator = Validator.extend({ message: 'This field is invalid.' });

      var res = Validator.validate('Test');

      chai.assert.isFalse(res.valid);

      chai.assert.equal(res.message, 'This field is invalid.');
    });
  });

  suite('Async Validators', function() {
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

  suite('Email Validator', function() {
    var EmailValidator = require('../../lib/validators/common/email.js');

    test('Should fail on non-email', function() {
      chai.assert.isFalse(EmailValidator.validate('Test').valid);
    });

    test('Should succeed on Email', function() {
      chai.assert.isTrue(
        EmailValidator.validate('adrian.bonnici@isobar.com').valid
      );
    });
  });

  suite('Number Validator', function() {
    var NumberValidator = require('../../lib/validators/common/number.js');

    test('Should fail on non-Number', function() {
      chai.assert.isFalse(NumberValidator.validate('Test').valid);
    });

    test('Should succeed on Number', function() {
      chai.assert.isTrue(NumberValidator.validate(15).valid);
    });

    test('Should succeed on Number with a Precision of 2 Decimal Points', function() {
      chai.assert.isTrue(NumberValidator.validate(9.99).valid);
    });
  });

  suite('Phone Validator', function() {
    var PhoneValidator = require('../../lib/validators/common/phone.js');

    test('Should fail on non-Phone', function() {
      chai.assert.isFalse(PhoneValidator.validate('Test').valid);
    });

    test('Should succeed on Phone', function() {
      chai.assert.isTrue(PhoneValidator.validate('(+30) 6986661996').valid);
    });
  });

  suite('Symbol Validator', function() {
    var SymbolValidator = require('../../lib/validators/common/symbol.js');

    test('Should fail on non-Symbols', function() {
      chai.assert.isFalse(SymbolValidator.validate('+ [ ] -').valid);
    });

    test('Should succeed on Symbols', function() {
      chai.assert.isTrue(
        SymbolValidator.validate('This is a valid testing string').valid
      );
    });
  });

  suite('Min value validator', function() {
    var MinValueValidator = require('../../lib/validators/common/minValue.js');

    test('Should fail on value less than 0', function() {
      chai.assert.isFalse(MinValueValidator.validate('-4').valid);
    });

    test('Should succeed on value larger than 0', function() {
      chai.assert.isTrue(MinValueValidator.validate('5').valid);
    });
  });

  suite('Min value extension validator', function() {
    var MinTwoValidator = require('../../lib/validators/common/minTwo.js');

    test('Should succeed on value larger than 2', function() {
      var { valid, message } = MinTwoValidator.validate('5');

      chai.assert.isNull(message);
      chai.assert.isTrue(valid);
    });
  });

  suite('ShouldMatch validator', function() {
    var ShouldMatchValidator = require('../../lib/validators/common/shouldMatch.js');

    ShouldMatchValidator.value = 'test12345';

    test('Should fail on different values', function() {
      chai.assert.isFalse(ShouldMatchValidator.validate('test123456').valid);
    });

    test('Should succeed on same values', function() {
      chai.assert.isTrue(ShouldMatchValidator.validate('test12345').valid);
    });
  });
});
