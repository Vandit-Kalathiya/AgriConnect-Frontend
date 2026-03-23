import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },

  // ── Vite config needs Node globals (process, __dirname, etc.) ────────────
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // ── Downgraded to warn / off ──────────────────────────────────
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',               // not enforced in this project
      'react/no-unescaped-entities': 'off',    // JSX apostrophes/quotes
      'react/no-unknown-property': 'off',      // allows jsx={}, cmdk-*, styled-jsx attrs
      'no-unused-vars': 'warn',                // warn, not block the build
      'no-undef': 'warn',                      // warn, not block the build
      'react-hooks/exhaustive-deps': 'warn',   // warn, not block the build
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
