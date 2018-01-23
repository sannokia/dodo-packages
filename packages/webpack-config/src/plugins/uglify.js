import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import plugin from '../plugin';

const uglify = (options, config) => plugin(new UglifyJSPlugin(options), config);

export default uglify;
