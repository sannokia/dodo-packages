import webpack from 'webpack';
import plugin from '../plugin';

const provide = (options, config) =>
  plugin(new webpack.ProvidePlugin(options), config);

export default provide;
