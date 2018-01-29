import isCurrency from '../testers/isCurrency';
import toDelimetedNumber from '../formatters/toDelimetedNumber';
import i18n from '@nemea/i18n-lib';
import _every from 'lodash/every';
import _first from 'lodash/head';

import Masker from './Masker';

var CurrencyMasker = Masker.extend({

  mask(value, oldValue, ctx, event, deleting = false) {

    value = value.replace(/,/g, '');

    // If every character is 0, truncate to just one 0
    if (_every(value, x => x === '0')) {
      return {
        value: '0',
        isValid: true
      };
    }

    // Remove insignificant zeroes from beginning of string
    value = value.replace(/^0+([0-9]+(\.[0-9]*)?)/, '$1');

    // Regex above will turn 0.03 -> .03. Re-add the zero in the beginning
    if (_first(value) === '.') {
      value = '0' + value;
    }

    var maxAmount = ctx.props.maxAmount;

    if (typeof ctx.props.maxAmount === 'undefined') {
      maxAmount = Infinity;
    }

    if (!isCurrency(value) || value < 0) {
      return {
        value: oldValue,
        isValid: false,
        message: null
      };
    }

    if (deleting || value > maxAmount) {
      var isValid = value <= maxAmount;
      return {
        value: deleting ? toDelimetedNumber(value) : oldValue,
        isValid,
        message: isValid ? null : this.message
      };
    }

    return {
      value: toDelimetedNumber(value),
      isValid: true
    };

  },

  message: i18n('insufficientFundsMessage')

});

export default CurrencyMasker;
