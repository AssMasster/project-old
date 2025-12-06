// .eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
    '@stylistic',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React правила
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    
    // Основные правила
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state', 'draft'],
      },
    ],
    'max-len': ['error', { code: 120 }],
    
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/operator-linebreak': ['error', 'before'],
  },
};