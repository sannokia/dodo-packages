// Cleaners
require('./cleaners/cleanDelimetedNumber.test');
require('./cleaners/cleanSpaces.test');
//
// // Formatters
require('./formatters/toBoolean.test');
require('./formatters/toDashedString.test');
require('./formatters/toDate.test');
require('./formatters/toDelimetedNumber.test');
require('./formatters/toIBAN.test');
require('./formatters/toMoney.test');
require('./formatters/toPercentage.test');
require('./formatters/toPrettyMonths.test');
require('./formatters/toTimeUnitWord.test');
require('./formatters/toYesNo.test');

// Helpers
require('./helpers/data/canTransactionBeAuthorised.test');

// Maskers
require('./maskers/claimCode.test');

// Testers
require('./testers/isAccountNumber.test');
require('./testers/isAmount.test');
require('./testers/isBIC.test');
require('./testers/isClaimCode.test');
require('./testers/isEmail.test');
require('./testers/isNumeric.test');

// Validators
require('./validators/ValidatorFactory.test');
