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
      Validator = Validator.extend({ message: 'This field is invalid.'});

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
        .then(() => { done(); })
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

  suite('IBAN Validator', function() {
    var IbanValidator = require('../../lib/validators/common/iban.js');

    test('Should fail on non-IBAN', function() {
      chai.assert.isFalse(IbanValidator.validate('Not a Valid IBAN').valid);
    });

    test('Should succeed on IBAN', function() {
      chai.assert.isTrue(IbanValidator.validate('AL47 2121 1009 0000 0002 3569 8741').valid);
    });

  });

  suite('Account Number Validator', function() {
    var AccountNumberValidator = require('../../lib/validators/fields/accountNumber.js');

    test('Should fail on an Account Number shorter than 4 digits', function() {
      chai.assert.isFalse(AccountNumberValidator.validate('123').valid);
    });

    test('Should fail on an Account Number longer than 20 digits', function() {
      chai.assert.isFalse(AccountNumberValidator.validate('12345678912345678912345').valid);
    });

    test('Should succeed on Account Number between 4 and 20 digits', function() {
      chai.assert.isTrue(AccountNumberValidator.validate('38832').valid);
    });

  });

  suite('Currency Validator', function() {
    var CurrencyValidator = require('../../lib/validators/common/currency.js');

    test('Should fail on non-currency', function() {
      chai.assert.isFalse(CurrencyValidator.validate('').valid);
    });

    test('Should succeed on Currency', function() {
      chai.assert.isTrue(CurrencyValidator.validate('1,000.00').valid);
    });

    test('Should succeed on Currency with Decimal Point', function() {
      chai.assert.isTrue(CurrencyValidator.validate('1,000,000.55').valid);
    });

  });

  suite('Email Validator', function() {

    var EmailValidator = require('../../lib/validators/common/email.js');

    test('Should fail on non-email', function() {
      chai.assert.isFalse(EmailValidator.validate('Test').valid);
    });

    test('Should succeed on Email', function() {
      chai.assert.isTrue(EmailValidator.validate('info@nemeabank.com').valid);
    });

  });

  suite('Nemea IBAN Validator', function() {

    var NemeaIbanValidator = require('../../lib/validators/fields/nemeaIban.js');

    test('Should fail on non-Nemea IBAN', function() {
      chai.assert.isFalse(NemeaIbanValidator.validate('MT25 VALL 2201 3000 0000 4002 1958 227').valid);
    });

    test('Should succeed on Nemea IBAN', function() {
      chai.assert.isTrue(NemeaIbanValidator.validate('MT60 NMEA 2501 4000 0000 0000 0038 832').valid);
    });

  });

  suite('Nemea Username Validator', function() {

    var NemeaUsernameValidator = require('../../lib/validators/fields/nemeaUsername.js');

    test('Should fail on non-Nemea Username', function() {
      chai.assert.isFalse(NemeaUsernameValidator.validate('Test').valid);
    });

    test('Should succeed on Nemea Username', function() {
      chai.assert.isTrue(NemeaUsernameValidator.validate('nemeabanktest+abeli.renergymc.com@gmail.com').valid);
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

  suite('Password Validator', function() {

    var PasswordValidator = require('../../lib/validators/common/password.js');

    test('Should fail on no input', function() {
      chai.assert.isFalse(PasswordValidator.validate('').valid);
    });

    test('Should fail on Password shorter than 8 characters', function() {
      chai.assert.isFalse(PasswordValidator.validate('Test').valid);
    });

    test('Should fail on Password longer than 15 characters', function() {
      chai.assert.isFalse(PasswordValidator.validate('OneTwoThreeFourFiveSixSevenEightNineTen').valid);
    });

    test('Should fail on Password without numbers', function() {
      chai.assert.isFalse(PasswordValidator.validate('Test').valid);
    });

    test('Should fail on Password without characters', function() {
      chai.assert.isFalse(PasswordValidator.validate('1024').valid);
    });

    test('Should succeed on Password', function() {
      chai.assert.isTrue(PasswordValidator.validate('Testing12345').valid);
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
      chai.assert.isTrue(SymbolValidator.validate('This is a valid testing string').valid);
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

  suite('ClaimCode validator', function() {

    var ClaimCodeValidator = require('../../lib/validators/fields/claimCode.js');

    test('Should fail on invalid claim code', function() {
      chai.assert.isFalse(ClaimCodeValidator.validate('test-2341-f34').valid);
    });

    test('Should succeed on same values', function() {
      chai.assert.isTrue(ClaimCodeValidator.validate('test-test-1234').valid);
    });

  });
});
