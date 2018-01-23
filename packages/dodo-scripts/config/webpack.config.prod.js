/* eslint no-useless-escape: 0 */

const paths = require('./paths');
const flow = require('lodash/flow');
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
  bundleAnalyzer,
  uglify,
  eslint,
  handlebars,
  babel,
  sass,
  stylelint,
  url,
  copy,
  imagemin
} = require('@dodo/webpack-config');

const getClientEnvironment = require('./env');

const env = getClientEnvironment();

const publicPath = paths.servedPath;

const buildConfig = flow(
  entry({
    'app.entry': paths.appIndexJs
  }),
  output({
    path: paths.appBuild,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].[chunkhash].chunk.js',
    publicPath
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
    lodash: require.resolve('lodash'),
    jquery: require.resolve('jquery'),
    $: require.resolve('jquery'),
    events: paths.resolveApp('packages/events')
  }),
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
  replace(/moment[\/\\]locale$/, /en|fr|fi|es|nl|el/),
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
  bundleAnalyzer(),
  uglify({
    parallel: true,
    uglifyOptions: {
      output: {
        comments: false
      },
      compress: {
        ie8: false,
        drop_console: true,
        warnings: false
      }
    }
  }),
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
  })
);

const build = buildConfig({});

module.exports = build;
