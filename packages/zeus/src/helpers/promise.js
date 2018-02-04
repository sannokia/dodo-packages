var { getDuration } = require('./utils');

module.exports = {
  _onsuccess(res) {
    var extra = res.extra || {};
    var body = extra.__noLogResponse ? { __response__: 'hidden' } : res.body;

    global.log.zeus.info(
      'API call completed successfully: ' + res.apiRelativeUrl + ', ',
      {
        reqObj: res.reqOptsLog,
        guid: res.guid,
        apiPath: res.apiPath,
        apiRelativeUrl: res.apiRelativeUrl,
        info: res._info,
        body,
        duration: getDuration(res.start)
      }
    );
  },

  _onerror(err) {
    global.log.zeus.error(
      'API call failed: ' + err._info.status + ', ' + err.apiRelativeUrl + ', ',
      {
        reqObj: err.reqOptsLog,
        guid: err.guid,
        apiPath: err.apiPath,
        apiRelativeUrl: err.apiRelativeUrl,
        err: err.err,
        info: err._info,
        body: err.body,
        duration: getDuration(err.start)
      }
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
