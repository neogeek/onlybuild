/* node:coverage disable */

import test, { describe } from 'node:test';

import { copyFileAndMakeDir } from './copy.js';

describe('copy', async () => {
  test('copyFileAndMakeDir', async () => {
    await copyFileAndMakeDir(
      './tests/mocks/highlight.js/gdscript.js',
      './temp/highlight.js/gdscript.js'
    );
  });
});
