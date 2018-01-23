import webpack from 'webpack';
import plugin from '../plugin';
import compose from 'lodash/fp/compose';

const hmr = config => plugin(new webpack.HotModuleReplacementPlugin(), config);

const namedModules = config => plugin(new webpack.NamedModulesPlugin(), config);

const config = compose(hmr(), namedModules());

export default () => config;
