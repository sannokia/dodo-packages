/* eslint max-statements: 0 */

var Q = require('q');
var _ = require('lodash');
var utils = require('../helpers/utils');
var uuidV4 = require('uuid/v4');
var request = require('request');
var zeusPromise = require('../helpers/promise');
var pathHelper = require('path');

const builder = {
  processResponse: (err, response, body) => {
    var obj = {};
    response = response || {};

    obj.status = response.statusCode;
    obj.success = obj.status === 200;

    if (_.isObject(body)) {
      obj.isJSON = true;
    } else {
      try {
        var json = JSON.parse(body);
        obj.isJSON = true;
        obj.body = json;
      } catch (e) {
        obj.isJSON = false;
        obj.body = body;
      }
    }

    return obj;
  },

  bindDefaults: (promise, bindingOptions) => {
    var defaults = {
      defaultSuccess(res, pipeResponse) {
        return function(hres) {
          if (pipeResponse) {
            return res.json(hres.body);
          }

          res.sendStatus(200);
        };
      },

      defaultFail(res, pipeResponse) {
        return function(hres) {
          if (pipeResponse) {
            return res.status(500).json(hres.body);
          }

          res.sendStatus(500);
        };
      },

      defaultHandlers(hreq, res, pipeResponse) {
        var pipeSuccessResponse;
        var pipeFailResponse;

        if (_.isObject(pipeResponse)) {
          pipeSuccessResponse = !!pipeResponse.success;
          pipeFailResponse = !!pipeResponse.fail;
        } else {
          pipeSuccessResponse = pipeFailResponse = pipeResponse;
        }

        hreq
          .then(defaults.defaultSuccess(res, pipeSuccessResponse))
          .fail(defaults.defaultFail(res, pipeFailResponse));

        return hreq;
      }
    };

    return function(res, options) {
      options = _.defaults({}, options || {}, bindingOptions || {});

      if (options.bindSuccess) {
        promise.then(defaults.defaultSuccess(res, options.pipeSuccessResponse));
      }

      if (options.bindFail) {
        promise.fail(defaults.defaultFail(res, options.pipeFailResponse));
      }

      // Enable chaining
      return promise;
    };
  },

  functionOptions: (values) => {
    var opts = {};

    _.forOwn(values, function(value, key) {
      if (key.indexOf('_') === 0) {
        opts[key.substring(1)] = value;
      }
    });

    return opts;
  },

  functionCall: (
    req,
    ZeusInstance,
    opts,
    params,
    body,
    reqOpts = {},
    apiOpts,
    extra
  ) => {
    var defer = Q.defer();
    var guid = uuidV4();
    var promise = zeusPromise._bind(defer.promise, guid);

    var reqOptsLog = reqOpts;

    if (body && typeof opts.preProcess === 'function') {
      body = opts.preProcess(body, extra);
    }

    if (utils.isValidGuid(req.headers['x-api-request-uuid'] || '')) {
      guid = req.headers['x-api-request-uuid'];
    }

    try {
      var headers = {};

      var defaults = {
        headers,
        url: utils.urlify(opts.url, params, opts.prefix, apiOpts),
        method: opts.method || 'get'
      };

      var apiRelativeUrl = utils.pathify(
        utils.urlify(
          opts.url,
          params,
          '',
          Object.assign({}, apiOpts, { api: '' })
        )
      );

      // Process Headers

      headers['x-api-request-uuid'] = guid;

      if (req) {
        if (req.headers['x-forwarded-for']) {
          headers['x-forwarded-for'] = req.headers['x-forwarded-for'];
        }

        if (req.headers['x-real-ip']) {
          headers['x-real-ip'] = req.headers['x-real-ip'];
        }

        if (req.headers['user-agent']) {
          headers['user-agent'] = req.headers['user-agent'];
        }

        headers['x-request-language'] =
          req.headers['x-request-language'] || req.requestLanguage || 'en';
      }

      var apiPath = utils.pathify(opts.url);

      var remainingParams = utils.checkRemainingParams(defaults.url);

      if (remainingParams) {
        throw new Error(
          'Some URL parameters are not set: ' + remainingParams.join(', ')
        );
      }

      var result = _.defaults(opts.reqOpts || {}, defaults);

      Object.assign(result.headers, reqOpts.headers, headers);

      reqOptsLog = reqOpts = result;

      // Process Body

      if (body) {
        if (typeof body === 'object') {
          var logbody = _.cloneDeep(body);

          if (body.__hide) {
            reqOptsLog = _.cloneDeep(reqOpts);

            if (body.__hide === true) {
              logbody = { hidden: 'Body is hidden' };
            } else {
              _.each(body.__hide, function(hideKey) {
                if (_.has(logbody, hideKey)) {
                  _.set(logbody, hideKey, 'xxx');
                }
              });
            }

            delete body.__hide;
            delete logbody.__hide;
          }

          if (!body.__form) {
            reqOptsLog.body = logbody;
            reqOpts.json = true;
            reqOpts.body = body;
          } else {
            delete body.__form;
            delete logbody.__form;
            reqOpts.form = body;
            reqOptsLog.form = logbody;
          }
        }
      }

      var start = Date.now();

      const requestObj = {
        reqObj: reqOptsLog,
        apiPath,
        apiRelativeUrl,
        guid
      };

      global.app.log.zeus.info(
        `API Request: ${apiRelativeUrl}, ${JSON.stringify(requestObj)}`
      );

      request(reqOpts, function(err, response, body) {
        var processed = builder.processResponse(err, response, body);

        if (processed.body) {
          body = processed.body;
          delete processed.body;
        }

        processed.url = reqOpts.url;

        if (err || !processed.success) {
          if (processed.status === 401 && processed.status === 403) {
            var eventObj = {};

            if (req && req.user) {
              eventObj = _.extend({ user: req.user }, eventObj);
            }

            eventObj = _.extend({ req }, eventObj);

            ZeusInstance.eventEmitter.emit('zeus:unauthorized', eventObj);
          }

          var errorEventObj = {
            err,
            body,
            guid,
            start,
            _info: processed,
            reqOpts,
            reqOptsLog,
            opts,
            apiRelativeUrl,
            apiPath
          };

          ZeusInstance.eventEmitter.emit('zeus:fail', errorEventObj);

          defer.reject(errorEventObj);
        } else {
          if (processed.status >= 200 && processed.status <= 300) {
            ZeusInstance.eventEmitter.emit('zeus:success');
          }

          if (typeof opts.postProcess === 'function') {
            body = opts.postProcess(processed, body, extra);
          }

          var completedEventObj = {
            url: reqOpts.url,
            user: null,
            body,
            response,
            reqOpts,
            reqOptsLog,
            guid,
            start,
            _info: processed,
            extra,
            opts,
            apiRelativeUrl,
            apiPath
          };

          if (req && req.user) {
            completedEventObj.user = req.user;
          }

          ZeusInstance.eventEmitter.emit('zeus:complete', completedEventObj);

          defer.resolve(completedEventObj);
        }
      });
    } catch (e) {
      var errorEventObj = {
        err: e,
        body: null,
        guid,
        start,
        reqOpts,
        reqOptsLog,
        extra,
        opts,
        apiPath,
        _info: {
          success: false,
          status: 0
        }
      };

      ZeusInstance.eventEmitter.emit('zeus:fail', errorEventObj);

      defer.reject(errorEventObj);
    }

    promise.bindDefaults = builder.bindDefaults(promise, {
      bindSuccess: true,
      bindFail: true,
      pipeSuccessResponse: true,
      pipeFailResponse: false
    });

    promise.bindSuccess = _.partial(
      builder.bindDefaults(promise, { bindSuccess: true })
    );
    promise.bindFail = _.partial(
      builder.bindDefaults(promise, { bindFail: true })
    );
    promise.bindSuccessWithResponse = _.partial(
      builder.bindDefaults(promise, {
        bindSuccess: true,
        pipeSuccessResponse: true
      })
    );
    promise.bindFailWithResponse = _.partial(
      builder.bindDefaults(promise, { bindFail: true, pipeFailResponse: true })
    );

    return promise;
  },

  functionBuilder: (ZeusInstance, dict, apiOpts, functions, path, prefix) => {
    functions = functions || {};
    prefix = dict._prefix || prefix || '';
    apiOpts = apiOpts || {};

    _.forIn(dict, function(value, key) {
      var currentPath = value._path || path || '';

      if (value._subpath) {
        currentPath = pathHelper.join(currentPath, value._subpath);
      }

      if (key.indexOf('_') === 0) {
        return;
      }

      if (value._noop) {
        functions[key] = {};
      } else {
        var opts = builder.functionOptions(value);
        opts.url = currentPath;
        opts.prefix = prefix;

        var func = function(req, params, body, reqOpts, extra) {
          opts.params = params || {};
          opts.reqOpts = reqOpts || {};
          opts.body = body || {};
          return builder.functionCall(
            req,
            ZeusInstance,
            opts,
            params,
            body,
            reqOpts,
            apiOpts,
            extra
          );
        };

        func._info = opts;
        functions[key] = func;
      }

      builder.functionBuilder(
        ZeusInstance,
        value,
        apiOpts,
        functions[key],
        currentPath,
        prefix
      );
    });

    return functions;
  }
};

module.exports = builder;
