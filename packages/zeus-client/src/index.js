import events from '@dodo/events';
import uuidV4 from 'uuid/v4';
import _extend from 'lodash/extend';
import $ from 'jquery';

class Zeus {
  constructor(options) {
    if (process.env.TEST_MODE) {
      this.callCount = 0;
    }

    options = _extend(
      {},
      {
        headers: {},
        xhrHandler() {}
      },
      options
    );

    this.headers = options.headers;
    this.xhrHandler = options.xhrHandler;
  }

  extendXhrOptions(options) {
    options = _extend(
      {},
      {
        prefix: '/__api',
        headers: {}
      },
      options
    );

    var apiGuid = uuidV4();

    options.headers = _extend({}, options.headers, this.headers, {
      'x-api-request-uuid': apiGuid
    });

    if (options.prefix) {
      options.url = options.prefix + options.url;
    }

    options.cache = false;

    return options;
  }

  request(options) {
    if (typeof options === 'string') {
      options = { url: options };
    }

    options = this.extendXhrOptions(options || {});

    if (options.data) {
      options.data = JSON.stringify(options.data);
      options.contentType = 'application/json';
    }

    var request = $.ajax(options);

    this.bindHandlers(request, options);

    return request;
  }

  bindHandlers(xhr, options) {
    if (process.env.TEST_MODE) {
      this.callCount++;
    }
    this.xhrHandler(xhr, options);
    this.emit('activity', { xhr, options });
    return xhr;
  }
}

events.mixin(Zeus);

export default Zeus;
