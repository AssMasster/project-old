// eslint.config.js
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import functionalPlugin from 'eslint-plugin-functional'

export default [
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
      functional: functionalPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/external-module-folders': ['node_modules', '../node_modules'],
    },
    rules: {
      // Отключаем правила React, которые не нужны
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      
      // Основные правила
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state', 'draft'],
        },
      ],
      
      // Import правила
      'import/no-cycle': 'off',
      'import/no-extraneous-dependencies': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/button-has-type': 'off',
      'import/prefer-default-export': 'off',
      
      // Max length
      'max-len': ['error', { 
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      
      // Стилевые правила (ТОЧНО такие же как в тестах!)
      'semi': ['error', 'never'],
      'brace-style': ['error', '1tbs'],
      'arrow-parens': ['error', 'always'],
      'operator-linebreak': ['error', 'before'],
    },
  },
]