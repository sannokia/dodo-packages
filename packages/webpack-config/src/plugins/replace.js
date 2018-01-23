import webpack from 'webpack';
import plugin from '../plugin';

const replace = (options, config) =>
  plugin(new webpack.ContextReplacementPlugin(options), config);

export default replace;
