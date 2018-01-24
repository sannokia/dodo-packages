'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ReducerRegistry {
  constructor(initialReducers = {}) {
    this._reducers = (0, _extends3.default)({}, initialReducers);
    this._emitChange = null;
  }
  register(newReducers) {
    this._reducers = (0, _extends3.default)({}, this._reducers, newReducers);

    if (this._emitChange !== null) {
      this._emitChange(this.getReducers());
    }
  }
  getReducers() {
    return (0, _extends3.default)({}, this._reducers);
  }
  setChangeListener(listener) {
    if (this._emitChange !== null) {
      throw new Error('Can only set the listener for a ReducerRegistry once.');
    }

    this._emitChange = listener;
  }
}

exports.default = ReducerRegistry;
module.exports = exports['default'];
//# sourceMappingURL=ReducerRegistry.js.map