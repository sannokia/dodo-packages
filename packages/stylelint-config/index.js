module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'color-hex-case': 'upper',
    'color-hex-length': 'long',
    'color-named': 'never',
    'color-no-invalid-hex': true,

    'function-url-quotes': 'always',
    'selector-attribute-quotes': 'always',
    'string-quotes': 'single',

    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,

    'value-keyword-case': 'lower',
    'value-no-vendor-prefix': true,

    'no-descending-specificity': true,
    'no-duplicate-selectors': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,

    'property-case': 'lower',
    'property-no-unknown': true,
    'property-no-vendor-prefix': true,

    'shorthand-property-no-redundant-values': true,

    'declaration-bang-space-after': 'always',
    'declaration-bang-space-before': 'always',
    'declaration-colon-space-after': 'always',

    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,

    'max-nesting-depth': 4,
    'selector-max-compound-selectors': 3,
    'selector-no-qualifying-type': true
  }
};
