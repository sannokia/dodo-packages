import ValidatorFactory from './ValidatorFactory';
import i18n from '@nemea/i18n-lib';
import _find from 'lodash/find';
import _extend from 'lodash/extend';
import _compact from 'lodash/compact';

class BaseValidator {

  constructor() {

    if (!this.async) {
      this.validate = (function(fn) {

        return function(value, message) {

          var validateArgs = arguments;

          if (this.validators) {
            var responses = this.validators.map((validator) => {
              var response = validator.validate(...validateArgs);

              response.validator = validator;
              return response;
            });

            var selectedResponse = _find(responses, (response) => {
              return !response.valid;
            }) || this.createResponse({ valid: true });

            selectedResponse.responses = responses;

            return selectedResponse;

          } else {
            var valid = fn.apply(this, validateArgs);

            return this.createResponse({
              valid,
              message
            });
          }

        };

      })(this.validate);
    }

  }

  extend(props) {
    return ValidatorFactory.create(_extend({}, Object.getPrototypeOf(this), props));
  }

  get async() {
    return !!this._async;
  }

  set async(val) {
    this._async = !!val;
  }

  get message() {
    if (!this._message) {
      this._message = i18n('errors.invalid');
    }

    return this._message;
  }

  set message(message) {
    this._message = message;
  }

  createResponse(obj) {

    var { valid, message } = obj;

    if (!message) {
      message = this.message;
    }

    if (!valid && typeof message === 'function') {
      message = message.apply(this);
    }

    return {
      valid,
      message: !valid ? message : null,
      getErrorMessages: (function() {
        return function() {

          if (!this.responses) {
            return !valid ? [message] : [];
          }

          return _compact(this.responses.map((response) => {
            return response.message;
          }));

        };
      }).bind(this)()

    };

  }

}

export default BaseValidator;
