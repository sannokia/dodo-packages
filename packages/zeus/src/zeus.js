var events = require('events');
var _ = require('lodash');
var { functionBuilder } = require('./builder');

/*
  On instantiating a Zeus object with the relevant options,
  the API dictionary is parsed and relevant function entries
  for each API call are created as properties to the Zeus instance
*/

module.exports = (opts) => {
  var dict = opts.dict || {};
  var api = opts.api;
  var apiOpts = { api };
  var eventEmitter = new events.EventEmitter();

  var zeus = {
    eventEmitter,

    req: null,

    res: null,

    init(dict) {
      var functions = functionBuilder(this, dict, apiOpts);
      var functionList = [];
      var functionListDetailed = [];
      (function(list) {
        function recurse(list, stack) {
          stack = stack || '';

          _.forOwn(list, function(value, key) {
            // Don't continue parsing internal function information.. no need
            if (key === '_info') {
              return;
            }

            var name = stack + (stack.length ? '.' : '') + key;

            if (typeof value === 'function') {
              functionList.push(name);

              functionListDetailed.push({
                name,
                info: value._info
              });
            }

            recurse(value, name);
          });
        }

        return recurse(list);
      })(functions);

      this.functionList = functionList;
      this.functionListDetailed = functionListDetailed;

      Object.assign(zeus, functions);
    },

    list(verbose) {
      return verbose ? this.functionListDetailed : this.functionList;
    },

    bindReq(req) {
      this.req = req;
    },

    bindRes(res) {
      this.res = res;
    },

    bindReqRes(req, res) {
      this.bindReq(req);
      this.bindRes(res);
    }
  };

  zeus.init(dict);

  return zeus;
};
