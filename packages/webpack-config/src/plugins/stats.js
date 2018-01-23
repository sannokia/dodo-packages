import StatsPlugin from 'stats-webpack-plugin';
import plugin from '../plugin';

const stats = (filename, options, config) =>
  plugin(new StatsPlugin(filename, options), config);

export default stats;
