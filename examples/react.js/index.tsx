import React from 'react';
import { renderToString } from 'react-dom/server';

function Hello() {
  return <h1>Hello, React!</h1>;
}

export default renderToString(<Hello />);
