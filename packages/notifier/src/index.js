var notifier = (title) => {
  if (!global.config.env.isDevelopment && !global.config.env.isTest) {
    module.exports = {
      notify() {}
    };
  } else {
    var notifier = require('node-notifier');

    var notify = notifier.notify;

    var defaults = {
      title
    };

    notifier.notify = function(options) {
      return notify.call(notifier, Object.assign({}, defaults, options));
    };

    return notifier;
  }
};

module.exports = notifier;
