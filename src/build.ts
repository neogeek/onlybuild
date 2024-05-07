import { writeFile, mkdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

/**
 * Write the file to the build directory while creating the directory, recursively, if it doesn't exist.
 *
 * @param {string} path
 * @param {string} buildDir
 * @param {string} contents
 */
export const writeFileAndMakeDir = async (
  path: string,
  buildDir: string,
  contents: string
) => {
  const filename = basename(path, '.mjs');

  const directory =
    filename === 'index'
      ? join(buildDir, dirname(path))
      : join(buildDir, dirname(path), filename);

  await mkdir(directory, { recursive: true });

  await writeFile(join(directory, 'index.html'), contents);
};

/**
 * Import the default export of a JavaScript file and check that the default export is a string before writing the contents to a build file.
 *
 * @param {string} path
 * @param {string} buildDir
 */
export const buildFile = async (path: string, buildDir: string) => {
  const contents = (await import(resolve(path))).default;

  if (typeof contents === 'string') {
    await writeFileAndMakeDir(path, buildDir, contents);
  }
};

/**
 * Iterate over all the file paths and write them to the build directory.
 *
 * @param {string[]} paths
 * @param {string} buildDir
 */
export const buildFiles = async (paths: string[], buildDir: string) => {
  await Promise.all(paths.map(async path => await buildFile(path, buildDir)));
};
