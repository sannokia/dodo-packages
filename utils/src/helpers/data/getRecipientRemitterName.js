import _includes from 'lodash/includes';

var getRecipientRemitter = function(options) {

  options = options || {};

  var name = '';

  if (!options) {
    return name;
  }

  if (_includes(options.accountIds, options.creditAccountId)) {
    name = options.remitterName;
  }

  if (_includes(options.accountIds, options.debitAccountId)) {
    name = options.beneficiaryName;
  }

  if (options.beneficiaryName === options.remitterName) {
    name = options.remitterName;
  }

  if (!name) {
    name = 'Nemea Bank';
  }

  return name;

};

export default getRecipientRemitter;
