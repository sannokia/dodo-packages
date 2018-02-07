import { bindActionCreators } from 'redux';

import _mapValues from 'lodash/mapValues';

var bindActionCreatorsToNamespace = (actionCreators, namespace, dispatch) => {
  var boundActionCreators = _mapValues(actionCreators, (func) => {
    return func.bind(null, namespace);
  });

  return bindActionCreators(boundActionCreators, dispatch);
};

export { bindActionCreatorsToNamespace };
