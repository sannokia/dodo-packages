module.exports = {
  extends: '@dodo/eslint-config-legacy',
  parser: 'babel-eslint',
  plugins: ['babel', 'eslint-plugin-import'],
  rules: {
    'import/extensions': 1
  },
  env: {
    es6: true
  }
};
