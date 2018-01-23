import CommonsPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import plugin from '../plugin';

const common = (options, config) => plugin(new CommonsPlugin(options), config);

export default common;
