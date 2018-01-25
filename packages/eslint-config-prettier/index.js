// prettier-ignore
module.exports = {
  'extends': [
    "plugin:prettier/recommended"
  ],
  'rules': {
    'prettier/prettier': ['error', { parser: 'flow', singleQuote: true, trailingComma: 'none', arrowParens: 'always' }]
  }
};
