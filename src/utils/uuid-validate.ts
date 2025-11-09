import { validate } from 'uuid';
import type { uuid } from '../models/uuid.js';

export function uuidValidate(id: uuid): boolean {
  return validate(id);
}