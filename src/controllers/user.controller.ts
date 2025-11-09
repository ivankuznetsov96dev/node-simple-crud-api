import { IncomingMessage, ServerResponse } from "http";
import { users } from "../db/db-users.js";
import { uuidValidate } from "../utils/uuid-validate.js";
import { User } from "../interfaces/user.interface.js";
import { v4 as uuidv4 } from "uuid";
import { isUserValid } from "../utils/user-validate.js";

export async function handleUsers(req: IncomingMessage, res: ServerResponse) {
  try {
    const urlParts = req.url?.split("/") ?? [];
    const method = req.method;
    const userId = urlParts[3];

    //@Get /api/users
    if (method === "GET" && urlParts.length === 3) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
      return;
    }

    //@Get /api/users/:id
    if (method === "GET" && userId) {
      if (!uuidValidate(userId)) {
        res.writeHead(400);
        res.end("Invalid UUID");
        return;
      }

      const user = users.find(u => u.id === userId);
      if (!user) {
        res.writeHead(404);
        res.end("User Not Found");
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
      return;
    }

    //@Post /api/users
    if (method === "POST" && urlParts.length === 3) {
      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });
      
      req.on("end", () => {
        try {
          const data = JSON.parse(body);

          if (isUserValid(data)) {
            res.writeHead(400);
            res.end("Invalid user data");
            return;
          }

          const newUser: User = {
            id: uuidv4(),
            ...data
          };
          users.push(newUser);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newUser));
          
        } catch (error) {
          res.writeHead(400);
          res.end("Invalid User Data fields");
        }
      });

      return;
    }

    //@Put /api/users/:id
    if (method === "PUT" && userId) {
      if (!uuidValidate(userId)) {
        res.writeHead(400);
        res.end("Invalid UUID");
        return;
      }

      const index = users.findIndex(u => u.id === userId);
      if (index === -1) {
        res.writeHead(404);
        res.end("User Not Found");
        return;
      }

      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body);

          if (isUserValid(data)) {
            res.writeHead(400);
            res.end("Invalid user data");
            return;
          }

          users[index] = {
            ...users[index],
            ...data
          };

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(users[index]));          
        } catch (error) {
          res.writeHead(400);
          res.end("Invalid User Data fields");
        }
      });

      return;
    }

    //@Delete /api/users/:id
    if (method === "DELETE" && userId) {
      if (!uuidValidate(userId)) {
        res.writeHead(400);
        res.end("Invalid UUID");
        return;
      }

      const index = users.findIndex(u => u.id === userId);
      if (index === -1) {
        res.writeHead(404);
        res.end("User Not Found");
        return;
      }

      users.splice(index, 1);
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404);
    res.end('Route not found');

  } catch (error) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}