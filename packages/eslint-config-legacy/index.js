module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'max-statements': [1, 30],
    'brace-style': [1, '1tbs', { allowSingleLine: true }],
    'keyword-spacing': 1,
    'func-names': 0,
    eqeqeq: 2,
    'one-var': [2, 'never'],
    'no-multiple-empty-lines': [1, { max: 2 }],
    'no-undef': 2,
    'no-unused-vars': 1,
    'no-console': 0,
    'no-use-before-define': 2,
    'no-multi-spaces': 1,
    'no-class-assign': 2,
    'no-redeclare': 2,
    'constructor-super': 2,
    'prefer-spread': 0,
    'no-this-before-super': 2,
    'no-dupe-class-members': 2,
    'no-trailing-spaces': [1, { skipBlankLines: true }],
    'object-shorthand': 1,
    'arrow-spacing': 1,
    'space-before-function-paren': [1, 'never'],
    'jsx-quotes': 1,
    quotes: [2, 'single'],
    semi: [2, 'always']
  },
  env: {
    browser: true,
    node: true
  }
};
