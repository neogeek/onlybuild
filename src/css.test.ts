/* node:coverage disable */

import test, { describe } from 'node:test';
import assert from 'node:assert';

import { css } from './css.js';

describe('css string template utility', async () => {
  test('simple css string', () => {
    assert.equal(
      css`
        body {
          color: red;
        }
      `,
      `
        body {
          color: red;
        }
      `
    );
  });
  test('simple css string with variable', () => {
    const color = 'red';
    assert.equal(
      css`
        body {
          color: ${color};
        }
      `,
      `
        body {
          color: red;
        }
      `
    );
  });
});
