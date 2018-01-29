global.app = { settings: {} };

var Logger = require('../lib');

var defaultLogger = Logger.createLogger({
  consoleJSON: true,
  consoleJSONstringify: true,
  metadata: {
    testMeta: 'hello'
  }
});

var zeusLogger = Logger.createLogger({
  name: 'zeus',
  consoleJSON: true,
  consoleJSONstringify: true
});

defaultLogger.info('TEST');
defaultLogger.info('TEST', 'meta1');
defaultLogger.info('TEST', 'meta1', 'meta2', { meta: 'obj1' });
defaultLogger.info('TEST', 'meta1', 'meta2', {
  meta: 'obj',
  nested: { nest: 'Hello' }
});
defaultLogger.info('TEST');
defaultLogger.warn('TEST');
defaultLogger.error('TEST');
defaultLogger.error('TEST', { meta1: 'meta1' });
zeusLogger.info('TEST ZEUS', 'some meta');
zeusLogger.info('TEST ZEUS', 'some meta', { meta: 'obj' });
zeusLogger.warn('TEST ZEUS');
