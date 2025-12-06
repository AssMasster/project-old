// eslint.config.js - обновленная версия
import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: ['**/node_modules/**', 'dist/**', 'build/**'],
  },
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
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
      
      // Базовые правила ESLint - ВКЛЮЧИТЬ СТРОГО
      'semi': ['error', 'never'],
      'no-unused-vars': ['error'],
      
      // ВСЕ правила @stylistic как в тестах
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': ['error'],
      '@stylistic/jsx-one-expression-per-line': ['error'],
      '@stylistic/semi': ['error', 'never'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]