import React from 'react';
import { renderToString } from 'react-dom/server';

function Hello({ name = 'world' }) {
  return <h1>Hello, {name}!</h1>;
}

export default `<!DOCTYPE html>
${renderToString(
  <html lang="en">
    <head>
      <title>Hello, world!</title>
    </head>
    <body>
      <Hello name="world" />
    </body>
  </html>
)}`;
