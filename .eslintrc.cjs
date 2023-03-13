module.exports = {
    extends: ['plugin:prettier/recommended'],
    plugins: ['react', '@typescript-eslint', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'esnext',
        ecmaFeatures: { jsx: true },
        useJSXTextNode: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                paths: './tsconfig.json',
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
    rules: {
        camelcase: 'off',
        'prettier/prettier': 'error',
        'react/jsx-no-bind': 'off',
    },
};
