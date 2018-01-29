import currencies from './currencies';
import memoize from '../functions/memoize';
import _has from 'lodash/has';

var getCurrencySymbol = function(currencyId) {
  var symbol = currencyId;
  var currency = currencies[symbol];

  if ( _has(currencies, symbol) ) {
    currency.symbol && ( symbol = currency.symbol );
  }

  return symbol;
};

export default memoize(getCurrencySymbol);
