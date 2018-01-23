/* eslint no-useless-escape: 0 */

const paths = require('./paths');
const flow = require('lodash/flow');
const set = require('lodash/fp/set');
const autoprefixer = require('autoprefixer');

const {
  entry,
  modules,
  extensions,
  alias,
  define,
  output,
  loaderOptions,
  lodash,
  replace,
  commons,
  extractText,
  assets,
  stats,
  duplicatePackageChecker,
  bundleAnalyzer,
  uglify,
  eslint,
  handlebars,
  babel,
  sass,
  hmr,
  url
} = require('@dodo/webpack-config');

const getClientEnvironment = require('./env');

const env = getClientEnvironment();

const buildConfig = flow(
  entry({
    main: paths.appMainJs,
    'index.test': paths.appTestJs
  }),
  output({
    path: paths.appBuild,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].[chunkhash].chunk.js',
    publicPath: paths.appPublic,
    pathinfo: true
  }),
  modules([
    paths.appPath,
    paths.appPublic,
    paths.appScripts,
    paths.appStyles,
    paths.appPackages,
    paths.appNodeModules
  ]),
  extensions(['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']),
  alias({
    lodash: paths.resolveApp('node_modules/lodash'),
    jquery: paths.resolveApp('node_modules/jquery'),
    $: paths.resolveApp('node_modules/jquery'),
    events: paths.resolveApp('packages/events')
  }),
  set(['devtool'], 'eval-source-map'),
  loaderOptions({
    options: {
      postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
      sassLoader: {
        outputStyle: 'expanded',
        includePaths: [
          paths.appPublic,
          paths.appSrc,
          paths.appStyles,
          paths.appNodeModules
        ]
      },
      eslint: {
        failOnWarning: false,
        failOnError: false,
        quiet: true,
        emitError: false
      }
    }
  }),
  define(env.stringified),
  lodash({
    shorthands: true,
    collections: true,
    memoizing: true,
    flattening: true,
    paths: true,
    caching: true
  }),
  hmr(),
  replace(/moment[\/\\]locale$/, /en|fr|fi|es|nl|el/),
  commons({
    name: 'main',
    minChunks: 2
  }),
  extractText({
    filename: '[name].css',
    allChunks: false
  }),
  assets(),
  stats('stats.json', {
    chunkModules: true,
    exclude: [/node_modules\/(?!@dodo)/]
  }),
  duplicatePackageChecker(),
  bundleAnalyzer(),
  uglify({
    sourceMap: false,
    comments: false,
    compress: {
      screw_ie8: true,
      drop_console: true,
      warnings: false
    }
  }),
  eslint(),
  handlebars(),
  babel({
    babelrc: false,
    presets: [paths.resolveOwn('@dodo/babel-preset-react')],
    cacheDirectory: true
  }),
  sass(),
  url({
    limit: 10000,
    name: '[path][name].[ext]',
    context: paths.appPublic
  })
);

const build = buildConfig({});

module.exports = build;
