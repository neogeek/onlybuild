#!/usr/bin/env -S node --no-warnings

import 'dotenv/config';

import 'tsx/esm';

import { globby } from 'globby';

import chalk from 'chalk';

import parseCmdArgs from 'parse-cmd-args';

import { buildFiles, writeFiles } from '../src/build.js';
import { copyFiles } from '../src/copy.js';

import pkg from '../package.json' with { type: 'json' };

const elapsedTimeLabel = 'Elapsed time';

console.time(elapsedTimeLabel);

const args = parseCmdArgs(null, {
  requireUserInput: false
});

if (args.flags['--version'] || args.flags['-v']) {
  process.stdout.write(`${pkg.version}\n`);
  process.exit();
} else if (args.flags['--help'] || args.flags['-h']) {
  process.stdout.write(`Usage: onlybuild <path> [options]

  Options:

   -h, --help            Display this help message.
   -v, --version         Display the current installed version.
   -o, --out             Sets build directory. Default path is build/
   -i, --ignore          Sets ignore file path. Default path is .onlyignore
`);
  process.exit();
}

const [buildDir = 'build/'] = [args.flags['--out'], args.flags['-o']]
  .filter(flag => typeof flag === 'string')
  .map(String);

const [ignoreFile = '.onlyignore'] = [args.flags['--ignore'], args.flags['-i']]
  .filter(flag => typeof flag === 'string')
  .map(String);

const filesToBuild = await globby(
  [
    '**/*.mjs',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '!_*/**/*',
    '!node_modules/',
    `!${buildDir}`
  ].filter(Boolean),
  {
    gitignore: false,
    ignoreFiles: [ignoreFile],
    cwd: args.inputs[0]
  }
);

const filesToCopy = await globby(
  [
    '**/*',
    '!**/*.mjs',
    '!**/*.jsx',
    '!**/*.ts',
    '!**/*.tsx',
    '!_*/**/*',
    '!package.json',
    '!package-lock.json',
    '!node_modules/',
    `!${buildDir}`
  ],
  {
    gitignore: false,
    ignoreFiles: [ignoreFile],
    cwd: args.inputs[0]
  }
);

const filesToWrite = await buildFiles(filesToBuild);

await writeFiles(filesToWrite, buildDir);

await copyFiles(filesToCopy, buildDir);

console.log(`Wrote ${chalk.green(filesToWrite.length)} file(s).`);
console.log(`Copied ${chalk.green(filesToCopy.length)} file(s).`);

console.log('');

console.timeEnd(elapsedTimeLabel);

export {};
