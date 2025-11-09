import type { uuid } from "../models/uuid.js";

export interface User {
  id: uuid;
  username:  string;
  age: number;
  hobbies: string[];
}