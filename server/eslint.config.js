import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules', 'dist', 'build', 'coverage']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            ...js.configs.recommended.rules,

            // Error prevention
            'no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }],
            'no-console': 'off', // Allow console in backend
            'no-debugger': 'warn',

            // Best practices
            'eqeqeq': ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'warn',
            'prefer-arrow-callback': 'warn',
            'no-duplicate-imports': 'error',
            'no-return-await': 'error',

            // Async/await
            'require-await': 'warn',
            'no-async-promise-executor': 'error',

            // Security
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',

            // Code quality
            'curly': ['error', 'all'],
            'default-case': 'warn',
            'no-empty-function': 'warn',
            'no-useless-return': 'warn',
        },
    },
];
