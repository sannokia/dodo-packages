/* Base Partials */
import alias from './alias';
import entry from './entry';
import env from './env';
import extensions from './extensions';
import mainFields from './main-fields';
import modules from './modules';
import output from './output';
import plugin from './plugin';
import loader from './loader';

/* Partial Loaders */
import babel from './loaders/babel';
import css from './loaders/css';
import eslint from './loaders/eslint';
import handlebars from './loaders/handlebars';
import postcss from './loaders/postcss';
import sass from './loaders/sass';
import style from './loaders/style';
import url from './loaders/url';

/* Partial Plugins */
import assets from './plugins/assets';
import bundleAnalyzer from './plugins/bundle-analyzer';
import commons from './plugins/commons';
import dashboard from './plugins/dashboard';
import define from './plugins/define';
import duplicatePackageChecker from './plugins/duplicate-package-checker';
import hmr from './plugins/hot-module-reloading';
import loaderOptions from './plugins/loader-options';
import lodash from './plugins/lodash';
import scopeHoist from './plugins/module-concatenation';
import provide from './plugins/provide';
import replace from './plugins/replace';
import stats from './plugins/stats';
import stylelint from './plugins/stylelint';
import uglify from './plugins/uglify';
import extractText from './plugins/extract-text';
import copy from './plugins/copy';
import imagemin from './plugins/imagemin';

export {
  alias,
  entry,
  env,
  extensions,
  mainFields,
  modules,
  output,
  plugin,
  loader,
  babel,
  css,
  eslint,
  handlebars,
  postcss,
  sass,
  style,
  url,
  assets,
  bundleAnalyzer,
  commons,
  dashboard,
  define,
  duplicatePackageChecker,
  hmr,
  loaderOptions,
  lodash,
  scopeHoist,
  provide,
  replace,
  stats,
  stylelint,
  uglify,
  extractText,
  copy,
  imagemin
};
