import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, parse, resolve } from 'node:path';

/**
 * Calculates the output path of the file based on the original input path.
 *
 * @param {string} path
 */
export const calculateOutputPathFromInputPath = (path: string) => {
  const filename = parse(path).name;

  const directory =
    filename === 'index' ? dirname(path) : join(dirname(path), filename);

  return join(directory, 'index.html');
};

/**
 * Returns the default export if it is a string.
 *
 * @param {string} path
 * @returns {Promise<{ path: string; contents: string }>}
 */
export const buildFile = async (
  path: string
): Promise<{ path: string; contents: string }> => {
  const contents = (await import(resolve(path))).default;

  return { path, contents: typeof contents === 'string' ? contents : '' };
};

/**
 * Iterate over all file paths and returns the default export for each file if it is a string.
 *
 * @param {string[]} paths
 * @returns {Promise<{ path: string; contents: string }[]>}
 */
export const buildFiles = async (
  paths: string[]
): Promise<{ path: string; contents: string }[]> => {
  return (
    await Promise.all(paths.map(async path => await buildFile(path)))
  ).filter(({ contents }) => contents !== '');
};

/**
 * Writes the contents of a file to a path, creating parent directories as needed.
 *
 * @param {string} path
 * @param {string} contents
 */
export const writeFileAndMakeDir = async (path: string, contents: string) => {
  await mkdir(dirname(path), { recursive: true });

  await writeFile(path, contents);
};

/**
 * Write files to the build directory.
 *
 * @param {{ path: string; contents: string }[]} files,
 * @param {string} buildDir
 */
export const writeFiles = async (
  files: { path: string; contents: string }[],
  buildDir: string
) => {
  await Promise.all(
    files.map(async file => {
      await writeFileAndMakeDir(
        join(buildDir, calculateOutputPathFromInputPath(file.path)),
        file.contents
      );
    })
  );
};
