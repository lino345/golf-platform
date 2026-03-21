import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // 🌐 FRONTEND (React)
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['backend/**'], // ⬅️ VERY IMPORTANT
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // 🖥️ BACKEND (Node.js)
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node, // ✅ fixes require, module, global
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
])