import ExtractTextPlugin from 'extract-text-webpack-plugin';
import plugin from '../plugin';

const extractText = (options, config) =>
  plugin(new ExtractTextPlugin(options), config);

export default extractText;
