const http = require('http');

http.get('http://localhost:3001/uploads/book-1782442401130-979277847.png', (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', () => {});
  res.on('end', () => console.log('Done'));
}).on('error', (e) => {
  console.error('Error:', e.message);
});
