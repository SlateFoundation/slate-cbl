module.exports = {
    ignorePatterns: ['node_modules/', 'vendor/', 'public/'],
    root: true,
  
    env: {
      node: true,
      browser: true
    },
  
    extends: [
      'plugin:vue/recommended',
      '@vue/airbnb',
      'plugin:cypress/recommended',
    ],
  
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'eqeqeq': 'off',
      'no-plusplus': 'off',
      'import/no-extraneous-dependencies': ['error', {'devDependencies': true}]
    },
  
    parserOptions: {
      parser: 'babel-eslint',
    },
  
    globals: {
      Vue: true,
      moment: true,
      swal: true,
      '$': true,
      '_': true,
      axios: true,
    },
  
    overrides: [
      {
        files: [
          '**/__tests__/*.{j,t}s?(x)',
          '**/tests/Javascript/**/*.spec.{j,t}s?(x)'
        ],
        env: {
          jest: true
        }
      }
    ]
  };
  