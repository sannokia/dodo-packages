import ImageminPlugin from 'imagemin-webpack-plugin';
import plugin from '../plugin';

const imagemin = (options, config) =>
  plugin(new ImageminPlugin(options), config);

export default imagemin;
