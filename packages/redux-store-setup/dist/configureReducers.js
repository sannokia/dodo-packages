'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = configureReducers;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureReducers(asyncReducers) {
  var newReducers = (0, _redux.combineReducers)((0, _extends3.default)({}, asyncReducers, {
    router: _reactRouterRedux.routerReducer
  }));

  return newReducers;
}
module.exports = exports['default'];
//# sourceMappingURL=configureReducers.js.map