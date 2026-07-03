import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { isDirectory } from './files.js';

/**
 * Copies a file from one path to another, creating parent directories as needed.
 *
 * @param {string} src
 * @param {string} dest
 */
export const copyFileAndMakeDir = async (src: string, dest: string) => {
  if (await isDirectory(src)) {
    await mkdir(dest, { recursive: true });
    return;
  }

  await mkdir(dirname(dest), { recursive: true });

  await copyFile(src, dest);
};

/**
 * Iterate over all file paths and copy them to the build directory.
 *
 * @param {string[]} paths
 * @param {string} buildDir
 */
export const copyFiles = async (paths: string[], buildDir: string) => {
  await Promise.all(
    paths.map(
      async path => await copyFileAndMakeDir(path, join(buildDir, path))
    )
  );
};
