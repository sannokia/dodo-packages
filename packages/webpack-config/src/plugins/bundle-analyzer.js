import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import plugin from '../plugin';

const bundleAnalyzer = (options, config) =>
  plugin(new BundleAnalyzerPlugin(options), config);

export default bundleAnalyzer;
