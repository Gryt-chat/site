import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // Both answer differently on the build machine and in a browser, so a prerendered page
    // using either fails to hydrate. GRYT-1197.
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{
          name: 'motion/react',
          importNames: ['useReducedMotion'],
          message: "motion's useReducedMotion reads the media query on the first render, and the prerendered page can't. Use usePrefersReducedMotion from src/lib.",
        }],
      }],
      'no-restricted-syntax': ['error', {
        selector: "CallExpression[callee.property.name=/^toLocale(Date|Time)?String$/]",
        message: "This uses the visitor's locale and time zone, and the prerendered page can't know either. Format dates with src/lib/formatDate.",
      }],
    },
  },
])
