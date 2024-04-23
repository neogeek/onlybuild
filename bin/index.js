#!/usr/bin/env node

import { globby } from 'globby';

import { buildFiles } from '../src/build.js';
import { copyFiles } from '../src/copy.js';

await buildFiles(
  await globby(['**/*.mjs', '!_*/**/*', '!node_modules/', '!build/'], {
    gitignore: true,
    ignoreFiles: ['.onlyignore']
  }),
  'build/'
);

await copyFiles(
  await globby(
    [
      '**/*',
      '!**/*.mjs',
      '!_*/**/*',
      '!package.json',
      '!package-lock.json',
      '!node_modules/',
      '!build/'
    ],
    {
      gitignore: true,
      ignoreFiles: ['.onlyignore']
    }
  ),
  'build/'
);

export {};
