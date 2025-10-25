/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Règles personnalisées
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
  ],
};
