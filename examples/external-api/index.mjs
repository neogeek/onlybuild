const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(
  response => response.json()
);

export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello, world!</title>
  </head>
  <body>
      <h1>Hello, world!</h1>
      <div>${posts
        .map(post => `<section><h2>${post.title}</h2><p>${post.body}</section>`)
        .join('\n')}</div>
  </body>
</html>`;
