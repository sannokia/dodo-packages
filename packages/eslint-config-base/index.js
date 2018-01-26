module.exports = {
  extends: '@dodo/eslint-config-legacy',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      modules: true
    }
  },
  plugins: ['babel', 'eslint-plugin-import'],
  rules: {
    'import/extensions': 1
  },
  env: {
    es6: true
  }
};
