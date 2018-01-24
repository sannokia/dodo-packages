'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.histoy = exports.reducerRegistry = exports.store = undefined;

var _ReducerRegistry = require('./ReducerRegistry');

var _ReducerRegistry2 = _interopRequireDefault(_ReducerRegistry);

var _configureStore = require('./configureStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducerRegistry = new _ReducerRegistry2.default();
const store = _configureStore.configureStore.bind(undefined, reducerRegistry);

exports.store = store;
exports.reducerRegistry = reducerRegistry;
exports.histoy = _configureStore.histoy;
exports.default = store;
//# sourceMappingURL=createStore.js.map