module.exports = {
  root: true,
  ignorePatterns: [
    'src/generated/**/*',
    'next.config.js',
    'tailwind.config.js',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'next',
  ],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'import/order': 'error',
    '@next/next/no-img-element': 'off',
  },
}
