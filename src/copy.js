import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * Copy the file to the build directory while creating the directory, recursively, if it doesn't exist.
 *
 * @param {string} path
 * @param {string} buildDir
 */
export const copyFileAndMakeDir = async (path, buildDir) => {
  await mkdir(join(buildDir, dirname(path)), { recursive: true });

  await copyFile(path, join(buildDir, path));
};

/**
 * Iterate over all the file paths and copy them to the build directory.
 *
 * @param {string[]} paths
 * @param {string} buildDir
 */
export const copyFiles = async (paths, buildDir) => {
  await Promise.all(
    paths.map(async path => await copyFileAndMakeDir(path, buildDir))
  );
};
