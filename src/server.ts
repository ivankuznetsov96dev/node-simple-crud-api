import dotenv from 'dotenv';
import http from 'http';
import { handleUsers } from './controllers/user.controller.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/users')) {
    handleUsers(req, res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});