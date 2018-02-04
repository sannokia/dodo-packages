var path = require('path');
var _ = require('lodash');

const utils = {
  getDuration: (start, end) => {
    end = end || Date.now();
    return end - start;
  },

  isValidGuid: (guid) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      guid
    );
  },

  pathify: (str) => {
    return str.replace(/^\/?(.*)/, '/$1');
  },

  urlify: (service, params, prefix, apiOpts) => {
    var url = path.join(apiOpts.api, prefix || '', service);
    params = params || {};

    url = url.replace(/:\//, '://');

    _.forIn(params, (value, key) => {
      if (_.isUndefined(value) || _.isNull(value)) {
        return;
      }

      var pattern = new RegExp('{\\(?' + key + '\\)?}', 'g');
      url = url.replace(pattern, value);
    });

    url = url.replace(/{\(.*?\)}/g, '');
    url = url.replace(/([^:])\/\/+/g, '$1/');

    return url;
  },

  checkRemainingParams: (val) => {
    return val.match(/{.*?}/g);
  }
};

module.exports = utils;
