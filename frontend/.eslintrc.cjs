// .eslintrc.js
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
    'react/jsx-uses-react': 'off',
    'react/button-has-type': 'off',
    'react/jsx-props-no-spreading': 'off',
    
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
    'max-len': ['error', { 
      code: 120,
      ignoreComments: true,
      ignoreStrings: true,
    }],
    
    // Правила @stylistic
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/operator-linebreak': ['error', 'before'],
  },
};