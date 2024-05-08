# onlybuild

> A zero-config cli for building static websites.

[![Test](https://github.com/neogeek/onlybuild/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/onlybuild/actions/workflows/test.workflow.yml)
[![Publish](https://github.com/neogeek/onlybuild/actions/workflows/publish.workflow.yml/badge.svg)](https://github.com/neogeek/onlybuild/actions/workflows/publish.workflow.yml)
[![Documentation](https://doxdox.org/images/badge-flat.svg)](https://doxdox.org/neogeek/onlybuild)
[![NPM version](https://img.shields.io/npm/v/onlybuild)](https://www.npmjs.org/package/onlybuild)
[![Join the chat at https://discord.gg/nNtFsfd](https://img.shields.io/badge/discord-join%20chat-7289DA.svg)](https://discord.gg/nNtFsfd)

## Features

- 🪄 Can be used without installing it via `npx onlybuild`
- 🐣 Small footprint when installed
- ⏱️ Fast build times, [see benchmark data](#Benchmark)
- 🧰 Use with any framework or no framework at all
- 📦 Easily deploy built files to any static file service, ex: Google Cloud Bucket, AWS S3, GitHub Pages
- 📖 Easily import data from local JSON files or fetch remote API data

## Social

- Star [this repo on GitHub](https://github.com/neogeek/onlybuild) for updates
- Follow me on [Bluesky](https://bsky.app/profile/scottdoxey.com) or [Twitter](https://twitter.com/neogeek)
- Join the [Discord](https://discord.gg/nNtFsfd)
- Follow me on [GitHub](https://github.com/neogeek/)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Quick Start Guide](#quick-start-guide)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Ignore Files](#ignore-files)
- [React](#react)
- [TypeScript](#typescript)
- [Formatting Files](#formatting-files)
- [Watching For Changes](#watching-for-changes)
- [Local Server](#local-server)
- [Examples](#examples)
- [Benchmark](#benchmark)
- [Testing](#testing)
- [Contributing](#contributing)
- [Community Roadmap](#community-roadmap)
- [License](#license)

## Install

### Globally

```bash
$ npm install onlybuild -g
```

```bash
$ onlybuild
```

### NPX

```bash
$ npx onlybuild
```

### Local

```bash
$ npm install onlybuild --save-dev
```

```json
{
  ...
  "scripts": {
    "build": "onlybuild"
  },
  ...
}
```

```bash
$ npm run build
```

## Usage

```bash
Usage: onlybuild <path> [options]

  Options:

   -h, --help            Display this help message.
   -v, --version         Display the current installed version.
   -o, --out             Sets build directory. Default path is build/
   -i, --ignore          Sets ignore file path. Default path is .onlyignore
   -t, --typescript      Parse TypeScript files. (experimental)
```

## Quick Start Guide

Create a new file `index.mjs` with the following contents:

```javascript
export default '<h1>Hello, world!</h1>';
```

Run `npx onlybuild` from the directory the `index.mjs` file is in.

That's it! You will now have a `build/` directory with an `index.html` file in it.

## Getting Started

### Simple Example

You can have the default export return a string.

```javascript
export default '<h1>Hello, world!</h1>';
```

### Method Example

You can have the default export generate a string at runtime via a method.

```javascript
const renderPage = () => '<h1>Hello, world!</h1>';

export default renderPage();
```

### Asynchronous Example

You can return asynchronously if you need to read a local file or call an external API.

```javascript
import { readFile } from 'node:fs/promises';

const renderPage = async () => await readFile('index.html', 'utf8');

export default renderPage();
```

```javascript
const comments = await fetch(
  'https://jsonplaceholder.typicode.com/posts/1/comments'
).then(response => response.json());

export default `<div>${comments
  .map(post => `<section><h2>${comments.name}</h2><p>${post.body}</section>`)
  .join('\n')}</div>`;
```

### Parse Markdown

You can run the contents through other libraries, for example, converting a Markdown file into HTML before returning it using libraries like [Marked](https://github.com/markedjs/marked).

```javascript
import { readFile } from 'node:fs/promises';

import { marked } from 'marked';

export default marked.parse(await readFile('index.md', 'utf8'));
```

### Parse Markdown w/ Syntax Highlighting

This Markdown example parses code blocks and adds CSS classes before rendering the page to HTML.

```javascript
import { readFile } from 'node:fs/promises';

import { Marked } from 'marked';

import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

export default marked.parse(await readFile('index.md', 'utf8'));
```

### <code>&#96;html&#96;</code> String Template Utility

The `onlybuild` library includes an optional <code>&#96;html&#96;</code> string template utility that can be used to add syntax highlighting and formatting to HTML, making it easier to author HTML in JavaScript.

```javascript
import { html } from 'onlybuild';

export default html`<h1>Hello, world!</h1>`;
```

Install the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) plugin in VS Code to help format the HTML on save.

## File Structure

When you run `npx onlybuild`, all `.mjs` files with a `export default` that returns a string will be captured and written to the `build/` directory. All other files will be copied with the same file structure to the `build` directory unless included in the `.onlyignore` file or in a default ignored directory, indicated by a leading `_` character.

If the name of your `.mjs` file is `index.mjs` the output will be saved to `index.html`, but if it's name is `something-else.mjs` the output will be saved to `something-else/index.mjs`.

See the example file structure below for a more comprehensive example that includes building files and copying static files.

<table>
<tr>
<th>
Files
</v>
<th>
Build Output
</th>
<tr>
<td>

```
├── _includes
│   └── head.mjs
├── about
│   └── index.mjs
├── blog
│   └── hello-world.mjs
├── css
│   └── styles.css
├── images
│   └── icon.png
└── index.mjs
```

</td>
<td>

```
├── index.html
├── css
│   └── styles.css
├── images
│   └── icon.png
├── about
│   └── index.html
└── blog
    └── hello-world
        └── index.html

```

</td></tr></table>

## Ignore Files

If you want to ignore files from being generated into static files or copied into the `build.` directory you can add them to an ignore file called `.onlyignore`, which has a syntax similar to [`.gitignore`](https://git-scm.com/docs/gitignore) files.

As stated in the previous section, any files in a directory with a leading `_` character will be automatically ignored. Example: `_includes` or `_data`.

```
*.md

screenshot.png

LICENSE
```

## React

If you want to use [React.js](https://react.dev/), instead of <code>&#96;html&#96;</code> string templates, you can do that by using `react-dom/server` in a `.tsx` file.

> [!WARNING]
> This feature is experimental and requires the use of the `--typescript` flag (see below).

```typescript
import React from 'react';
import { renderToString } from 'react-dom/server';

function Hello() {
  return <h1>Hello, React!</h1>;
}

export default renderToString(<Hello />);
```

## TypeScript

> [!WARNING]
> This feature is experimental.

By default `onlybuild` looks for `.mjs` files, but if you add the `--typescript` flag to the build command, it will also look for `.ts` files.

```bash
$ npx onlybuild --typescript
```

You will also need to add `"type": "module"` to your `package.json` file for imports to work correctly.

```json
{
  ...
  "type": "module",
  ...
}
```

## Formatting Files

If you want to reformat the HTML files in the build directory, you can use [Prettier](https://prettier.io/) after the build completes.

```json
{
  ...
  "scripts": {
    "build": "onlybuild",
    "format": "npx prettier --write \"build/**/*.html\""
  },
  ...
}
```

If your `build/` directory is in `.gitignore` (which it probably should be) you will need to ignore the `.gitignore` file by setting the `--ignore-path` flag to something else. The file you set it to doesn't need to exist.

```json
{
  ...
  "scripts": {
    "build": "onlybuild",
    "format": "npx prettier --write --ignore-path .prettierignore \"build/**/*.html\""
  },
  ...
}
```

## Watching For Changes

If you want to automatically rebuild the project when files are updated you can use [nodemon](https://nodemon.io/).

```json
{
  ...
  "scripts": {
    "build": "onlybuild",
    "watch": "npx nodemon --ext mjs,md,css --ignore ./build -x \"npm run build\""
  },
  ...
}
```

## Local Server

Serving the files once the build is complete is easy using the NPM package [http-server](https://github.com/http-party/http-server).

```json
{
  ...
  "scripts": {
    "build": "onlybuild",
    "serve": "npx http-server build"
  },
  ...
}
```

## Examples

1. [Hello, world!](./examples/hello-world/) - A simple Hello, world example.
1. [Markdown](./examples/markdown/) - Get the contents of a local Markdown file and convert the contents to HTML.
1. [External API](./examples/external-api/) - Output data fetched from an external API.
1. [<code>&#96;html&#96;</code> String Template](./examples/html-string-template/) - Use the <code>&#96;html&#96;</code> string template utility to add syntax highlighting to HTML.
1. [Includes](./examples/includes/) - An example that uses reusable includes for building multiple pages.
1. [React.js](./examples/react.js/) - An example using React.js to render HTML.

## Benchmark

> [!NOTE]
> Each run (for `onlybuild` only) was repeated 5 times and the lowest/fastest time was selected. This result set was generated on a MacBook Air (M1, 2020), macOS Sonoma 14.4.1, 8 GB memory.

Times shown are in seconds. Lower is better.

| Markdown Files                                 |      250 |      500 |     1000 |     2000 |     4000 |
| ---------------------------------------------- | -------: | -------: | -------: | -------: | -------: |
| onlybuild                                      |  `0.296` |  `0.356` |  `0.512` |  `0.770` |  `1.309` |
| [Hugo](https://gohugo.io/) v0.101.0            |  `0.071` |  `0.110` |  `0.171` |  `0.352` |  `0.684` |
| [Eleventy](https://www.11ty.dev/) 1.0.1        |  `0.584` |  `0.683` |  `0.914` |  `1.250` |  `1.938` |
| [Astro](https://astro.build/) 1.0.1            |  `2.270` |  `3.172` |  `5.098` |  `9.791` | `22.907` |
| [Gatsby](https://www.gatsbyjs.com/) 4.19.0-cli | `14.462` | `15.722` | `17.967` | `22.356` | `29.059` |

See more benchmark data at <https://www.zachleat.com/web/build-benchmark/>

To run the benchmarks locally you have to install `bc`. This can be done on macOS by using `brew install bc`.

Once you have `bc` installed, install NPM packages for the main repo, then navigate to the `tests/benchmarks` directory, install NPM packages there as well, and then run `./bin/run.sh` to start the benchmark tests.

## Testing

Run all tests via `npm test`.

- Tests are authored using the native [Node.js test runner](https://nodejs.org/api/test.html).
- Tests are run automatically via GitHub Actions on each new PR.
- For you add a new feature or fix a bug, please include the benchmark output in the PR along with your device stats.

## Contributing

Be sure to review the [Contributing Guidelines](./CONTRIBUTING.md) before logging an issue or making a pull request.

## Community Roadmap

The goal of this project is to keep the features it offers to a minimum, allowing you, the developer, to forge your own path. If you have feature requests or bugs, please create an issue and tag them with the appropriate tag. If an issue already exists, vote for it with 👍.

- [Feature Requests](https://github.com/neogeek/onlybuild/labels/enhancement)
- [Bugs](https://github.com/neogeek/onlybuild/labels/bug)

## License

[The MIT License (MIT)](./LICENSE)
