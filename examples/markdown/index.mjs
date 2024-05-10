import { readFile } from 'node:fs/promises';

import { marked } from 'marked';

export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello, world!</title>
  </head>
  <body>
    ${marked.parse(await readFile('index.md', 'utf8'))}
  </body>
</html>`;
