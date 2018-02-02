var Q = require('q');
var ZeusInstance = require('./zeus');

const fallbackLogger = () => {
  console.log('Global app logger not found, using console');

  var poly = () => console.log.apply(this, arguments);

  var polyLogs = {
    info: poly,
    error: poly,
    warn: poly
  };

  if (!global.app) {
    global.app = {
      log: {}
    };
  }

  global.log = polyLogs;
  global.app.log.zeus = polyLogs;
};

var ZeusWrapper = () => {
  var log = global.app && global.app.log;

  if (!log) {
    fallbackLogger();
  }

  Q.longStackSupport = true;

  return ZeusInstance;
};

module.exports = ZeusWrapper();
