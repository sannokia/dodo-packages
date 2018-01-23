import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import plugin from '../plugin';

const lodash = (options, config) =>
  plugin(new LodashModuleReplacementPlugin(options), config);

export default lodash;
