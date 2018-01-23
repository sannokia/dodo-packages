/**
 * Add a plugin to a webpack configuration.
 * @param {Object} plugin Plugin to add to the webpack configuration.
 * @param {Object} config Webpack configuration.
 * @returns {Object} New webpack configuration with the plugin added.
 */
export default options => config => {
  const { plugins = [] } = config;
  return {
    ...config,
    plugins: [...plugins, options]
  };
};
