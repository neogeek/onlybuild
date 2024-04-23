const comments = await fetch(
  'https://jsonplaceholder.typicode.com/posts/1/comments'
).then(response => response.json());

export default `<div>${comments.map(post => `<section><h2>${comments.name}</h2><p>${post.body}</section>`).join('\n')}</div>`;
