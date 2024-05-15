/* node:coverage disable */

import test, { describe } from 'node:test';
import assert from 'node:assert';

import { html } from './html.js';

describe('html string template utility', async () => {
  test('simple html string', () => {
    assert.equal(
      html`<span><b>this is a test</b></span>`,
      '<span><b>this is a test</b></span>'
    );
  });
  test('map', () => {
    assert.equal(
      html`<ul>
        ${[1, 2, 3, 4, 5].map(index => `<li>${index}</li>`)}
      </ul>`,
      '<ul>\n        <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>\n      </ul>'
    );
  });
  test('nested html string templates', () => {
    assert.equal(
      html`<ul>
        ${[1, 2, 3, 4, 5].map(index => html`<li>${index}</li>`)}
      </ul>`,
      '<ul>\n        <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>\n      </ul>'
    );
  });
});
