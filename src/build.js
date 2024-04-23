import { writeFile, mkdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

/**
 * @param {string[]} paths
 * @param {string} buildDir
 */
export const buildFiles = async (paths, buildDir) => {
  await Promise.all(
    paths.map(async path => {
      const filename = basename(path, '.mjs');

      const directory =
        filename === 'index'
          ? join(buildDir, dirname(path))
          : join(buildDir, dirname(path), filename);

      const html = (await import(resolve(path))).default;

      if (typeof html === 'string') {
        await mkdir(directory, { recursive: true });

        await writeFile(join(directory, `index.html`), html);
      }
    })
  );
};
