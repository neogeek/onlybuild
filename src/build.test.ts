/* node:coverage disable */

import test, { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs/promises';

import {
  buildFile,
  buildFiles,
  calculateOutputPathFromInputPath
} from './build.js';

describe('build files', async () => {
  test('calculate output path from input path', () => {
    assert.equal(calculateOutputPathFromInputPath('index.html'), 'index.html');
    assert.equal(
      calculateOutputPathFromInputPath('this-is-a-test.html'),
      'this-is-a-test/index.html'
    );
    assert.equal(
      calculateOutputPathFromInputPath('this-is-another-test/index.html'),
      'this-is-another-test/index.html'
    );
  });
  test('build file that returns a string', async () => {
    assert.deepEqual(
      await buildFile('./tests/mocks/export-returns-string.mjs'),
      {
        path: './tests/mocks/export-returns-string.mjs',
        contents: '<h1>Hello, string!</h1>'
      }
    );
  });
  test('build multiple files that returns a string', async () => {
    assert.deepEqual(
      await buildFiles(['./tests/mocks/export-returns-string.mjs']),
      [
        {
          path: './tests/mocks/export-returns-string.mjs',
          contents: '<h1>Hello, string!</h1>'
        }
      ]
    );
  });
  test('build file that returns a function', async () => {
    assert.deepEqual(
      await buildFile('./tests/mocks/export-returns-function.mjs'),
      {
        path: './tests/mocks/export-returns-function.mjs',
        contents: ''
      }
    );
  });
  test('build multiple files that returns a function', async () => {
    assert.deepEqual(
      await buildFiles(['./tests/mocks/export-returns-function.mjs']),
      []
    );
  });
  test("build file that doesn't return anything", async () => {
    assert.deepEqual(
      await buildFile('./tests/mocks/export-returns-nothing.mjs'),
      {
        path: './tests/mocks/export-returns-nothing.mjs',
        contents: ''
      }
    );
  });
  test("build multiple files that don't return anything", async () => {
    assert.deepEqual(
      await buildFiles(['./tests/mocks/export-returns-nothing.mjs']),
      []
    );
  });
  test('build multiple files that return different things', async () => {
    assert.deepEqual(
      await buildFiles([
        './tests/mocks/export-returns-string.mjs',
        './tests/mocks/export-returns-function.mjs',
        './tests/mocks/export-returns-nothing.mjs'
      ]),
      [
        {
          path: './tests/mocks/export-returns-string.mjs',
          contents: '<h1>Hello, string!</h1>'
        }
      ]
    );
  });
  test('write file (and make directory as needed)', async () => {
    const tmp = {};

    mock.method(fs, 'mkdir', async () => {});
    mock.method(fs, 'readFile', async path => tmp[path]);
    mock.method(
      fs,
      'writeFile',
      async (path, contents) => (tmp[path] = contents)
    );

    const { writeFileAndMakeDir } = await import('./build.js');

    await writeFileAndMakeDir('build/index.html', '<h1>Hello, world!</h1>');

    assert.equal(
      await fs.readFile('build/index.html'),
      '<h1>Hello, world!</h1>'
    );

    mock.reset();
  });
  test('write multiple files (and make directory as needed)', async () => {
    const tmp = {};

    mock.method(fs, 'mkdir', async () => {});
    mock.method(fs, 'readFile', async path => tmp[path]);
    mock.method(
      fs,
      'writeFile',
      async (path, contents) => (tmp[path] = contents)
    );

    const { writeFiles } = await import('./build.js');

    await writeFiles(
      [
        {
          path: 'index.html',
          contents: '<h1>Hello, world!</h1>'
        },
        {
          path: 'about.html',
          contents: '<h1>Hello, world!</h1>'
        }
      ],
      'build/'
    );

    assert.equal(
      await fs.readFile('build/index.html'),
      '<h1>Hello, world!</h1>'
    );

    assert.equal(
      await fs.readFile('build/about/index.html'),
      '<h1>Hello, world!</h1>'
    );

    mock.reset();
  });
});
