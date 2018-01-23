import CopyWebpackPlugin from 'copy-webpack-plugin';
import plugin from '../plugin';

const copy = (options, config) =>
  plugin(new CopyWebpackPlugin(options), config);

export default copy;
