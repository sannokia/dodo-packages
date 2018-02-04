var { getDuration } = require('./utils');

module.exports = {
  _onsuccess(res) {
    var extra = res.extra || {};
    var body = extra.__noLogResponse ? { __response__: 'hidden' } : res.body;
    var responseObj = {
      reqObj: res.reqOptsLog,
      guid: res.guid,
      apiPath: res.apiPath,
      apiRelativeUrl: res.apiRelativeUrl,
      info: res._info,
      body,
      duration: getDuration(res.start)
    };

    global.app.log.info(
      `API call completed successfully: ${res.apiRelativeUrl} ${JSON.stringify(
        responseObj
      )}`
    );
  },

  _onerror(err) {
    var responseObj = {
      reqObj: err.reqOptsLog,
      guid: err.guid,
      apiPath: err.apiPath,
      apiRelativeUrl: err.apiRelativeUrl,
      err: err.err,
      info: err._info,
      body: err.body,
      duration: getDuration(err.start)
    };

    global.app.log.error(
      `API call failed: ${err._info.status} ${
        err.apiRelativeUrl
      } ${JSON.stringify(responseObj)}`
    );
  },

  _ondone() {},

  _bind(p) {
    p.then(this._onsuccess);
    p.fail(this._onerror);
    p.finally(this._ondone);

    return p;
  }
};
