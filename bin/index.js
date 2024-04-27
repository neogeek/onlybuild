#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { globby } from 'globby';

import parseCmdArgs from 'parse-cmd-args';

import { buildFiles } from '../src/build.js';
import { copyFiles } from '../src/copy.js';

const args = parseCmdArgs(null, {
  requireUserInput: false
});

if (args.flags['--version'] || args.flags['-v']) {
  process.stdout.write(
    `${
      JSON.parse(
        await readFile(
          join(dirname(fileURLToPath(import.meta.url)), '../package.json'),
          'utf8'
        )
      ).version
    }\n`
  );
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

await buildFiles(
  await globby(['**/*.mjs', '!_*/**/*', '!node_modules/', `!${buildDir}`], {
    gitignore: false,
    ignoreFiles: [ignoreFile],
    cwd: args.inputs[0]
  }),
  buildDir
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
      `!${buildDir}`
    ],
    {
      gitignore: false,
      ignoreFiles: [ignoreFile],
      cwd: args.inputs[0]
    }
  ),
  buildDir
);

export {};
