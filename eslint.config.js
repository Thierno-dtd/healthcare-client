import js from '@eslint/js'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'dev-dist'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]
