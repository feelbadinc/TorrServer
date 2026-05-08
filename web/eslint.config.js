import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'import-x': importPlugin,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': ['warn', {
        trailingComma: 'all',
        singleQuote: true,
        jsxSingleQuote: true,
        printWidth: 120,
        arrowParens: 'avoid',
        semi: false,
        endOfLine: 'auto',
      }],
      'import-x/no-anonymous-default-export': 0,
      'import-x/prefer-default-export': 0,
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.js', '**/*.spec.js'] }],
      'import-x/order': ['warn', {
        groups: ['external', 'internal', ['parent', 'sibling']],
        'newlines-between': 'always',
      }],
      'import-x/no-unresolved': 0,
      'no-plusplus': 0,
      'consistent-return': 0,
      'no-nested-ternary': 0,
      'no-shadow': 0,
      'no-unused-vars': ['warn', { vars: 'local', args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      'react/jsx-uses-react': 1,
      'react/require-default-props': 0,
      'react/jsx-props-no-spreading': 0,
    },
  },
]
