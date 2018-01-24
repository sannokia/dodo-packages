import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import _compact from 'lodash/compact';

import configureReducers from './configureReducers';

const logger = createLogger();
const history = createHistory();
const saga = createSagaMiddleware();
const router = routerMiddleware(history);
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const middlewares = _compact([
  thunk,
  saga,
  router,
  (process.env.NODE_ENV === 'development') ? logger : null
]);

const enhancers = compose(
  applyMiddleware(...middlewares),
  reduxDevTools
);

const configureStore = (reducerRegistry, initialState = {}, sagas = {}) => {
  const rootReducer = configureReducers(reducerRegistry.getReducers());


  const store = createStore(
    rootReducer,
    initialState,
    enhancers
  );

  saga.run(sagas);

  reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(configureReducers(reducers));
  });

  return store;
};

export {
  configureStore,
  history
};

export default configureStore;
