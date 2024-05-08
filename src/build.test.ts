import test, { describe } from 'node:test';
import assert from 'node:assert';

import { buildFile, calculateOutputPathFromInputPath } from './build.js';

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
  test('build file that returns a function', async () => {
    assert.deepEqual(
      await buildFile('./tests/mocks/export-returns-function.mjs'),
      {
        path: './tests/mocks/export-returns-function.mjs',
        contents: ''
      }
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
});
