import InterpolateHtmlPlugin from 'interpolate-html-plugin';
import plugin from '../plugin';

const html = (options, config) =>
  plugin(new InterpolateHtmlPlugin(options), config);

export default html;
