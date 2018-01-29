import Masker from './Masker';

var ClaimCodeMasker = Masker.extend({
  mask(value, oldValue) {

    value = value.replace(/\-/g, '');

    if (value.length > 12 || !value.match(/^[a-zA-Z0-9]+$/)) {
      return {
        value: oldValue,
        isValid: false
      };
    }

    return {
      value: value.match(/[a-zA-Z0-9]{1,4}/g).join('-').toUpperCase(),
      isValid: true
    };
  }

});

export default ClaimCodeMasker;
