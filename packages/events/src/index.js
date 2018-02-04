import eventEmitter from 'eventemitter2';
import _extend from 'lodash/extend';

eventEmitter.prototype.trigger = eventEmitter.prototype.emit;

eventEmitter.mixin = (obj) => {
  _extend(obj.prototype, eventEmitter.prototype);
};

export default eventEmitter;
