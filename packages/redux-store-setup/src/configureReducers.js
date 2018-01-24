import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default function configureReducers(asyncReducers) {
  var newReducers = combineReducers({
    ...asyncReducers,
    router: routerReducer
  });

  return newReducers;
}
