import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import functionalPlugin from 'eslint-plugin-functional';

export default [
  js.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      functional: functionalPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
      'import/external-module-folders': ['node_modules', '../node_modules'],
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state', 'draft'],
        },
      ],
      'import/no-cycle': 'off',
      'import/no-extraneous-dependencies': 'off',
      'react/jsx-props-no-spreading': 'off',
      'max-len': ['error', { code: 120 }],
      'react/button-has-type': 'off',
      'import/prefer-default-export': 'off',
    },
  },
];
