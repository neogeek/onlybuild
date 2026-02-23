#!/usr/bin/env -S node --no-warnings

import 'tsx/esm';

import { glob, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';

import chalk from 'chalk';

import '../src/env.js';

import { buildFiles, writeFiles } from '../src/build.js';
import { copyFiles } from '../src/copy.js';

import pkg from '../package.json' with { type: 'json' };

const elapsedTimeLabel = 'Elapsed time';

console.time(elapsedTimeLabel);

const args = parseArgs({
  args: process.argv.slice(2),
  options: {
    version: { type: 'boolean', short: 'v' },
    help: { type: 'boolean', short: 'h' },
    out: { type: 'string', short: 'o' },
    ignore: { type: 'string', short: 'i' }
  },
  allowPositionals: true
});

if (args.values.version) {
  process.stdout.write(`${pkg.version}\n`);
  process.exit();
} else if (args.values.help) {
  process.stdout.write(`Usage: onlybuild <path> [options]

  Options:

   -h, --help            Display this help message.
   -v, --version         Display the current installed version.
   -o, --out             Sets build directory. Default path is build/
   -i, --ignore          Sets ignore file path. Default path is .onlyignore
`);
  process.exit();
}

const [buildDir = 'build/'] = [args.values.out].filter(Boolean).map(String);

const [ignoreFile = '.onlyignore'] = [args.values.ignore]
  .filter(Boolean)
  .map(String);

const filesToIgnore = existsSync(ignoreFile)
  ? (await readFile(ignoreFile, 'utf8')).split(/\n+/g).filter(Boolean)
  : [];

const filesToBuild = (
  await Array.fromAsync(
    glob(['**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx'].filter(Boolean), {
      exclude: ['node_modules/', '_*/**/*', buildDir, ignoreFile],
      cwd: args.positionals[0]
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
        ignoreFile,
        ...filesToIgnore
      ],
      cwd: args.positionals[0]
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
