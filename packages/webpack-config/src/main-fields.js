import set from 'lodash/fp/set';

const mainFields = options => config =>
  set(['resolve', 'mainFields'], options, config);

export default mainFields;
