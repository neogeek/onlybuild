/* node:coverage disable */

import test, { describe } from 'node:test';
import assert from 'node:assert';

import { findFiles, getPatternsFromGitIgnore } from './files.js';

describe('files', async () => {
  test('findFiles (with string patther)', async () => {
    const files = await findFiles('*.md');

    assert.deepEqual(files, ['CHANGELOG.md', 'CONTRIBUTING.md', 'README.md']);
  });
  test('findFiles (with pattern array)', async () => {
    const files = await findFiles(['*.md']);

    assert.deepEqual(files, ['CHANGELOG.md', 'CONTRIBUTING.md', 'README.md']);
  });
  test('findFiles (with cwd)', async () => {
    const files = await findFiles('*.md', undefined, process.cwd());

    assert.deepEqual(files, ['CHANGELOG.md', 'CONTRIBUTING.md', 'README.md']);
  });
  test('findFiles (with exclude array pattern)', async () => {
    const files = await findFiles('*.md', await getPatternsFromGitIgnore());

    assert.deepEqual(files, ['CHANGELOG.md', 'CONTRIBUTING.md', 'README.md']);
  });
  test('findFiles (with exclude array pattern)', async () => {
    const files = await findFiles('*.json', ['*lock.json', '*build.json']);

    assert.deepEqual(files, ['package.json', 'tsconfig.json']);
  });
  test('getPatternsFromGitIgnore', async () => {
    const files = await getPatternsFromGitIgnore();

    assert.deepEqual(files, ['node_modules/', 'dist/']);
  });
  test('getPatternsFromGitIgnore (with options)', async () => {
    const files = await getPatternsFromGitIgnore(process.cwd(), '.gitignore');

    assert.deepEqual(files, ['node_modules/', 'dist/']);
  });
});
