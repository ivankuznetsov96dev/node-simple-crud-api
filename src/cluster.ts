import cluster from 'cluster';
import dotenv from 'dotenv';
import os from 'os';
import http from 'http';
import { handleUsers } from './controllers/user.controller.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const numCPUs = os.availableParallelism() - 1;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} running`);
  const workers: any[] = [];
  let current = 0;

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT: Number(PORT) + i + 1});
    workers.push(worker);
  }

  const server = http.createServer((req, res) => {
    const worker = workers[current];
    worker.send('handleRequest', req.socket);
    worker.once('message', (msg: string) => {
      if (msg === "ready") {
        current = (current + 1) % workers.length;
      }
    });
    res.writeHead(200);
    res.end('Request distributed to worker');
  });

  server.listen(PORT, () => {
    console.log(`Load balancer on port ${PORT}`);
  });
} else {
  const port = Number(process.env.PORT) + cluster.worker!.id;

  const server = http.createServer((req, res) => {
    if (req.url?.startsWith("/api/users")) {
      handleUsers(req, res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  server.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
  });
}