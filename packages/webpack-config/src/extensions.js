import set from 'lodash/fp/set';

const extensions = options => config =>
  set(['resolve', 'extensions'], options, config);

export default extensions;
