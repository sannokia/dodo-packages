import webpack from 'webpack';
import plugin from '../plugin';

const moduleConcatenation = (options, config) =>
  plugin(new webpack.optimize.ModuleConcatenationPlugin(options), config);

export default moduleConcatenation;
