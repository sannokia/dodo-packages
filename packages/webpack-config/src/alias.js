import set from 'lodash/fp/set';

const alias = options => config => set(['resolve', 'alias'], options, config);

export default alias;
