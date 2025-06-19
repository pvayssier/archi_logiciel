import { createRequire } from 'node:module';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

const require = createRequire(import.meta.url);
const importResolverTS = require('eslint-import-resolver-typescript');

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: importResolverTS,
      },
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/rover',
              from: './src/mission-control',
              message: 'Rover ne doit pas importer MissionControl',
            },
            {
              target: './src/mission-control',
              from: './src/rover',
              message: 'MissionControl ne doit pas importer Rover',
            },
            {
              target: './src',
              from: './src/mission-control',
              message: 'MissionControl ne doit pas importer Rover',
            },
          ],
        },
      ],
    },
  },
];
