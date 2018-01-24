'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureReducers = exports.configureStore = exports.createStore = exports.ReducerRegistry = undefined;

var _ReducerRegistry = require('./ReducerRegistry');

var _ReducerRegistry2 = _interopRequireDefault(_ReducerRegistry);

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _configureStore = require('./configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _configureReducers = require('./configureReducers');

var _configureReducers2 = _interopRequireDefault(_configureReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ReducerRegistry = _ReducerRegistry2.default;
exports.createStore = _createStore2.default;
exports.configureStore = _configureStore2.default;
exports.configureReducers = _configureReducers2.default;
exports.default = _createStore2.default;
//# sourceMappingURL=index.js.map