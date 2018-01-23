import AssetsPlugin from 'assets-webpack-plugin';
import plugin from '../plugin';

const assets = (options, config) => plugin(new AssetsPlugin(options), config);

export default assets;
