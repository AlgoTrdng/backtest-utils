module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'max-len': ['error', { code: 150 }],
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    semi: ['error', 'never'],
    'newline-per-chained-call': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-await-in-loop': 0,
    'import/prefer-default-export': 0,
  },
}
