import set from 'lodash/fp/set';

const entry = values => config => set(['entry'], values, config);

export default entry;
