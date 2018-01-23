import set from 'lodash/fp/set';

const modules = options => config =>
  set(['resolve', 'modules'], options, config);

export default modules;
