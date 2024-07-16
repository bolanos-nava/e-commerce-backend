module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    // 'eslint:recommended',
    'plugin:prettier/recommended',
    'airbnb/hooks',
  ],
  overrides: [
    {
      env: { node: true },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: { sourceType: 'script' },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'implicit-arrow-linebreak': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
      },
    ],
    'no-unused-expressions': 'warn',
    'prettier/prettier': 'off',
    'padded-blocks': 'off',
    'nonblock-statement-body-position': 'off',
    'no-trailing-spaces': 'off',
    'lines-between-class-members': 'off',
    indent: 'off',
    'object-curly-newline': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
  },
};
