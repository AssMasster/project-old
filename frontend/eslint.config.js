// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // React правила
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      
      // Базовые ESLint правила (как в тестах)
      'semi': ['error', 'never'],
      'no-unused-vars': ['error'],
      
      // ВСЕ правила @stylistic из ошибок тестов:
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
      '@stylistic/brace-style': ['error', 'stroustrup'], // ← ИЗМЕНЕНО с '1tbs' на 'stroustrup'
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/jsx-closing-tag-location': ['error'],
      '@stylistic/jsx-indent': ['error', 2],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-one-expression-per-line': ['error'],
      '@stylistic/jsx-wrap-multilines': ['error'],
      '@stylistic/no-trailing-spaces': ['error'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/semi': ['error', 'never'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]