'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.history = exports.configureStore = undefined;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reduxLogger = require('redux-logger');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _compact2 = require('lodash/compact');

var _compact3 = _interopRequireDefault(_compact2);

var _configureReducers = require('./configureReducers');

var _configureReducers2 = _interopRequireDefault(_configureReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _reduxLogger.createLogger)();
const history = (0, _createBrowserHistory2.default)();
const saga = (0, _reduxSaga2.default)();
const router = (0, _reactRouterRedux.routerMiddleware)(history);
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const middlewares = (0, _compact3.default)([_reduxThunk2.default, saga, router, process.env.NODE_ENV === 'development' ? logger : null]);

const enhancers = (0, _redux.compose)((0, _redux.applyMiddleware)(...middlewares), reduxDevTools);

const configureStore = (reducerRegistry, initialState = {}, sagas = {}) => {
  const rootReducer = (0, _configureReducers2.default)(reducerRegistry.getReducers());

  const store = (0, _redux.createStore)(rootReducer, initialState, enhancers);

  saga.run(sagas);

  reducerRegistry.setChangeListener(reducers => {
    store.replaceReducer((0, _configureReducers2.default)(reducers));
  });

  return store;
};

exports.configureStore = configureStore;
exports.history = history;
exports.default = configureStore;
//# sourceMappingURL=configureStore.js.map