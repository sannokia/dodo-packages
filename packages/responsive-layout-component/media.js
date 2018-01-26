import matchMedia from 'matchmedia';
import _extend from 'lodash/extend';
import _each from 'lodash/each';
import events from 'events';

const TABLET_PORTRAIT_WIDTH = 1025;
const TABLET_PORTRAIT_HEIGHT = 1025;
const TABLET_LANDSCAPE_WIDTH = TABLET_PORTRAIT_HEIGHT;
const TABLET_LANDSCAPE_HEIGHT = TABLET_PORTRAIT_WIDTH;

const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${TABLET_LANDSCAPE_HEIGHT - 1}px)`,
  TABLET_PORTRAIT: `(min-width: ${TABLET_PORTRAIT_WIDTH}px) and (max-width: ${TABLET_PORTRAIT_HEIGHT}px) and (orientation: portrait)`,
  TABLET_LANDSCAPE: `(min-width: ${TABLET_PORTRAIT_WIDTH}px) and (max-width: ${TABLET_PORTRAIT_HEIGHT}px) and (orientation: landscape)`,
  DESKTOP: `(min-width: ${TABLET_LANDSCAPE_WIDTH + 1}px)`
};

var active;

var mqChannel = _extend({}, events.prototype);

var updateActive = function(name) {
  mqChannel.active = name;
  mqChannel.trigger('active', name);
};

_each(MEDIA_QUERIES, function(query, name) {
  var mq = matchMedia(query, { width: 1920 });

  if (mq.matches) {
    active = name;
  }

  mq.addListener(function() {
    if (mq.matches) {
      updateActive(name);
    }
  });

});

mqChannel.active = active;

export default mqChannel;
