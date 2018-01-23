/* eslint no-useless-escape: 0 */

const paths = require('./paths');
const path = require('path');
const flow = require('lodash/flow');
const set = require('lodash/fp/set');
const autoprefixer = require('autoprefixer');
const eslintFormatter = require('@dodo/dev-utils/eslintFormatter');

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
  eslint,
  handlebars,
  babel,
  sass,
  hmr,
  stylelint,
  url,
  copy,
  imagemin,
  dashboard
} = require('@dodo/webpack-config');

const getClientEnvironment = require('./env');

const env = getClientEnvironment();

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';

const buildConfig = flow(
  entry({
    main: [
      paths.resolveOwn('config/polyfills'),
      require.resolve('@dodo/dev-utils/webpackHotDevClient'),
      paths.appMainJs
    ],
    'app.entry': paths.appIndexJs
  }),
  output({
    pathinfo: true,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].[chunkhash].chunk.js',
    publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  }),
  modules([
    paths.appPath,
    paths.appPublic,
    paths.appScripts,
    paths.appStyles,
    paths.appPackages,
    'node_modules',
    paths.appNodeModules
  ].concat(
    // It is guaranteed to exist because we tweak it in `env.js`
    process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
  )),
  extensions(['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']),
  alias({
    lodash: paths.resolveApp('node_modules/lodash'),
    jquery: paths.resolveApp('node_modules/jquery'),
    $: paths.resolveApp('node_modules/jquery'),
    events: paths.resolveApp('packages/events'),
    'babel-runtime': path.dirname(
      require.resolve('babel-runtime/package.json')
    )
  }),
  set(['devtool'], 'cheap-module-source-map'),
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
  replace(/moment[\\]locale$/, /en|fr|fi|es|nl|el/),
  commons({
    name: 'main',
    minChunks: 2
  }),
  extractText({
    filename: '[name].css',
    allChunks: false
  }),
  assets({
    path: paths.appPath
  }),
  stats('stats.json', {
    chunkModules: true,
    exclude: [/node_modules\/(?!@dodo)/]
  }),
  stylelint({
    configFile: require.resolve('@dodo/stylelint-config'),
    syntax: 'scss',
    emitErrors: false
  }),
  duplicatePackageChecker(),
  eslint({
    formatter: eslintFormatter,
    eslintPath: require.resolve('eslint'),
    ignore: false,
    useEslintrc: false,
    configFile: require.resolve('@dodo/eslint-config-react'),
    failOnWarning: false,
    failOnError: false,
    quiet: true,
    emitError: false
  }),
  handlebars(),
  babel({
    babelrc: false,
    presets: [require.resolve('@dodo/babel-preset-react')],
    cacheDirectory: true
  }),
  sass(),
  url({
    limit: 10000,
    name: '[path][name].[ext]',
    context: paths.appPublic
  }),
  copy([{
    from: paths.resolveApp('src/images'),
    to: paths.resolveApp('public/images')
  }, {
    from: paths.resolveApp('src/fonts/*'),
    to: paths.resolveApp('public/fonts')
  }]),
  imagemin({
    progressive: true,
    test: /\.(jpe?g|png|gif|svg)$/i
  }),
  dashboard()
);

const build = buildConfig({});

module.exports = build;
