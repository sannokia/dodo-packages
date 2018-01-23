var flow = require('lodash/flow');

var {
  define,
  stylelint,
  modules,
  style,
  css,
  postcss
} = require('@dodo/webpack-config');

var postCssConfig = require('@dodo/postcss-config');

const buildConfig = flow(
  define({
    'process.env': {
      GLOBAL_CHANNEL: JSON.stringify(undefined)
    }
  }),
  stylelint({
    failOnError: false
  }),
  modules([__dirname, 'src', 'css', 'node_modules', '.storybook']),
  style({
    sourceMap: true,
    convertToAbsoluteUrls: true
  }),
  css({
    importLoaders: 1,
    modules: true,
    localIdentName: '[name]__[local]___[hash:base64:5]'
  }),
  postcss(postCssConfig)
);

const build = buildConfig({});

module.exports = build;
