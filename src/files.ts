import { EOL } from 'node:os';
import { join } from 'node:path';
import { glob, readFile } from 'node:fs/promises';

export const findFiles = async (
  pattern: string | readonly string[],
  excludePattern?:
    | ((fileName: string) => boolean)
    | readonly string[]
    | undefined,
  cwd?: string
) => {
  return await Array.fromAsync(
    glob(Array.isArray(pattern) ? pattern.filter(Boolean) : pattern, {
      exclude: Array.isArray(excludePattern)
        ? excludePattern.filter(Boolean)
        : excludePattern,
      cwd
    })
  );
};

export const getPatternsFromGitIgnore = async (
  cwd?: string,
  filename = '.gitignore'
) => {
  return (await readFile(cwd ? join(cwd, filename) : filename, 'utf8'))
    .split(EOL)
    .filter(Boolean);
};
