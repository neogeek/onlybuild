import { html } from 'onlybuild';

import head from './_includes/head.mjs';

export default html`<!DOCTYPE html>
  <html lang="en">
    ${head}
    <body>
      <h1>Hello, world!</h1>
      <p>A zero-config cli for building static websites.</p>
    </body>
  </html>`;
