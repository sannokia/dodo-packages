module.exports = {
  extends: '@dodo/eslint-config-base',

  parser: 'babel-eslint',

  plugins: ['babel', 'jsx-a11y', 'react'],

  rules: {
    'react/forbid-prop-types': 0,
    'react/jsx-boolean-value': 1,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-curly-spacing': 1,
    'react/jsx-indent-props': [1, 2],
    'react/jsx-max-props-per-line': 0,
    'react/jsx-no-bind': 1,
    'react/jsx-no-duplicate-props': 1,
    'react/jsx-no-undef': 1,
    'react/jsx-sort-prop-types': 0,
    'react/jsx-sort-props': 0,
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/no-danger': 0,
    'react/no-did-mount-set-state': 1,
    'react/no-did-update-set-state': 1,
    'react/no-direct-mutation-state': 1,
    'react/no-multi-comp': 0,
    'react/no-set-state': 0,
    'react/no-unknown-property': 1,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/sort-comp': 0,

    'jsx-a11y/anchor-has-content': ['error', { components: [] }],
    'jsx-a11y/aria-role': ['error', { ignoreNonDom: false }],
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/alt-text': [
      'error',
      {
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: [],
        object: [],
        area: [],
        'input[type="image"]': []
      }
    ],
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/label-has-for': ['error', { components: ['label'] }],
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-onchange': 'off',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
    'jsx-a11y/heading-has-content': ['error', { components: [''] }],
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/lang': 'error',
    'jsx-a11y/no-distracting-elements': [
      'error',
      {
        elements: ['marquee', 'blink']
      }
    ],
    'jsx-a11y/scope': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp'
        ]
      }
    ],
    'jsx-a11y/no-noninteractive-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp'
        ]
      }
    ],
    'jsx-a11y/accessible-emoji': 'error',
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/media-has-caption': [
      'error',
      {
        audio: [],
        video: [],
        track: []
      }
    ],
    'jsx-a11y/no-interactive-element-to-noninteractive-role': [
      'error',
      {
        tr: ['none', 'presentation']
      }
    ],
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        ul: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid'
        ],
        ol: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid'
        ],
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
        table: ['grid'],
        td: ['gridcell']
      }
    ],
    'jsx-a11y/no-noninteractive-tabindex': [
      'error',
      {
        tags: [],
        roles: ['tabpanel']
      }
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: [],
        aspects: ['noHref', 'invalidHref', 'preferButton']
      }
    ]
  }
};
