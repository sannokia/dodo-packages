import HtmlWebpackPlugin from 'html-webpack-plugin';
import plugin from '../plugin';

const html = (options, config) =>
  plugin(new HtmlWebpackPlugin(options), config);

export default html;
