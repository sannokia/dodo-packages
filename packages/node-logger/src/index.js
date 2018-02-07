var winston = require('winston');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var logPath = path.join(process.cwd(), '/logs');

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

// Cache static metadata
var pid = process.pid;
var env = _.get(global, 'config.env.node', 'development');

var defaultMetadata = function() {
  var metadata = {
    pid,
    env,
    timestamp: new Date().toISOString()
  };

  return metadata;
};

var loggingLevels = {
  levels: {
    info: 0,
    warn: 1,
    error: 2
  },
  colors: {
    info: 'green',
    warn: 'yellow',
    error: 'red'
  }
};

winston.setLevels(loggingLevels.levels);
winston.addColors(loggingLevels.colors);

var defaultLogger = {
  console: {
    level: 'info',
    colorize: 'all',
    label: 'Default'
  },

  dailyRotateFile: {
    datePattern: '.yyyy-MM-dd',
    filename: path.join(logPath, '/log.log')
  }
};

var defaults = {
  name: 'default',
  file: true,
  console: true,
  consoleJSON: true,
  consoleJSONstringify: true,
  metadata: {}
};

var config = require('winston/lib/winston/config');

var colors = require('colors/safe');

var palette = {
  info: {
    bg: colors.reset,
    braces: colors.cyan.bold,
    properties: colors.cyan.bold,
    values: colors.green.bold,
    body: colors.underline
  },
  error: {
    bg: colors.bgRed.white,
    braces: colors.white,
    properties: colors.green.bold,
    values: colors.white.bold,
    body: colors.bold
  },
  success: {
    bg: colors.bgBlack,
    braces: colors.cyan.bold,
    properties: colors.cyan.bold,
    values: colors.green.bold,
    body: colors.underline
  }
};

var stringify = require('./stringify');

var _colorizeJSON = function(obj, options) {
  if (_.isEmpty(obj)) {
    return '';
  }

  var levelColors = palette[options.level] || palette.info;

  if (_.get(obj, 'info.success') === true) {
    levelColors = palette.success;
  }

  try {
    return levelColors.bg(stringify(obj, { colors: levelColors }));
  } catch (e) {
    console.trace();
    console.log(e.stack);
  }
};

var Logger = {
  createLogger(opts) {
    opts = _.extend({}, defaults, opts || {});

    var defaultMetadataKeys = _.keys(defaultMetadata()).concat(
      _.keys(opts.metadata)
    );

    var transports = [];
    var transportOptions;

    if (opts.file) {
      transportOptions = _.extend({}, defaultLogger.dailyRotateFile, {
        filename: path.join(logPath, '/' + opts.name + '.log')
      });

      if (opts.handleExceptions) {
        transportOptions.handleExceptions = true;
      }

      transports.push(
        new (require('winston-daily-rotate-file'))(transportOptions)
      );
    }

    if (opts.console) {
      transportOptions = _.extend({}, defaultLogger.console, {
        label: opts.name
      });

      if (opts.consoleJSON) {
        if (opts.consoleJSONstringify) {
          transportOptions.json = false;

          if (transportOptions.colorize) {
            transportOptions.formatter = function(options) {
              var _colorize = _.partial(config.colorize, options.level);
              var hasExtraMeta =
                defaultMetadataKeys.length !== _.keys(options.meta).length;
              var logDefaultMeta = {};
              var logExtraMeta = _.extend({}, options.meta);

              _.each(defaultMetadataKeys, function(key) {
                logDefaultMeta[key] = options.meta[key];
                delete logExtraMeta[key];
              });

              return [
                _colorize(options.level),
                ': ',
                '[',
                options.label,
                '] ',
                _colorize(options.message),
                ' ',
                _colorizeJSON(logDefaultMeta, options),
                hasExtraMeta
                  ? '\n' + _colorizeJSON(logExtraMeta, options) + '\n'
                  : ''
              ].join('');
            };
          } else {
            transportOptions.stringify = true;
          }
        } else {
          transportOptions.json = true;
        }
      }

      transports.push(new winston.transports.Console(transportOptions));
    }

    if (!_.isEmpty(opts.logglyOpts)) {
      require('winston-loggly');
      transports.push(new winston.transports.Loggly(opts.logglyOpts));
    }

    var logger = new winston.Logger({
      transports,
      exitOnError: false
    });

    logger.rewriters.push(function(level, msg, meta) {
      return _.extend({}, meta, defaultMetadata(), opts.metadata);
    });

    return logger;
  }
};

module.exports = Logger;
