import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});