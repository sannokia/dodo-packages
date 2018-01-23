import webpack from 'webpack';
import plugin from '../plugin';

const loaderOptions = (options, config) =>
  plugin(new webpack.LoaderOptionsPlugin(options), config);

export default loaderOptions;
