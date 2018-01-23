import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import flow from 'lodash/flow';
import loader from '../loader';

import env from '../env';

const styleLoaders = [
  require.resolve('css-loader'),
  require.resolve('url-loader'),
  require.resolve('sass-loader')
];

const sass = (loaders = styleLoaders) => options => config =>
  loader(
    {
      test: /\.scss$/,
      use: loaders,
      options
    },
    config
  );

const developmentConfig = env('development', [sass()]);

const testConfig = env('test', [sass(path.resolve(__dirname, 'noop.js'))]);

const productionConfig = env('production', [
  sass(
    ExtractTextPlugin.extract({
      fallback: require.resolve('style-loader'),
      use: styleLoaders
    })
  )
]);

const buildConfig = flow(developmentConfig(), testConfig(), productionConfig());

export default buildConfig;
