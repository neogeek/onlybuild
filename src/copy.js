import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * @param {string[]} paths
 * @param {string} buildDir
 */
export const copyFiles = async (paths, buildDir) => {
  await Promise.all(
    paths.map(async path => {
      await mkdir(join(buildDir, dirname(path)), { recursive: true });

      await copyFile(path, join(buildDir, path));
    })
  );
};
