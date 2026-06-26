const express = require('express');
const { join } = require('path');
const app = express();

const path = join(__dirname, 'uploads');
console.log('Serving static files from:', path);

app.use('/uploads', express.static(path));

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});
