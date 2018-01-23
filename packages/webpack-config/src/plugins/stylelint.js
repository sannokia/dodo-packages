import StyleLintPlugin from 'stylelint-webpack-plugin';
import plugin from '../plugin';

const stylelint = (options, config) =>
  plugin(new StyleLintPlugin(options), config);

export default stylelint;
