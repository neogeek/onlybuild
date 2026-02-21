#!/usr/bin/env -S node --no-warnings

import 'tsx/esm';

import { glob } from 'node:fs/promises';

import chalk from 'chalk';

import parseCmdArgs from 'parse-cmd-args';

import '../src/env.js';

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

const filesToBuild = (
  await Array.fromAsync(
    glob(['**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx'].filter(Boolean), {
      exclude: ['node_modules/', '_*/**/*', buildDir, ignoreFile],
      cwd: args.inputs[0]
    })
  )
).filter(path => path.includes('.'));

const filesToCopy = (
  await Array.fromAsync(
    glob(['**/*'], {
      exclude: [
        '**/*.mjs',
        '**/*.jsx',
        '**/*.ts',
        '**/*.tsx',
        '_*/**/*',
        'package.json',
        'package-lock.json',
        'node_modules/',
        buildDir,
        ignoreFile
      ],
      cwd: args.inputs[0]
    })
  )
).filter(path => path.includes('.'));

const filesToWrite = await buildFiles(filesToBuild);

await writeFiles(filesToWrite, buildDir);

await copyFiles(filesToCopy, buildDir);

console.log(`Wrote ${chalk.green(filesToWrite.length)} file(s).`);
console.log(`Copied ${chalk.green(filesToCopy.length)} file(s).`);

console.log('');

console.timeEnd(elapsedTimeLabel);

export {};
