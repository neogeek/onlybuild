import { readFile } from 'node:fs/promises';

import { marked } from 'marked';

export default marked.parse(await readFile('index.md', 'utf8'));
