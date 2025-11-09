import { User } from "../interfaces/user.interface";

export function isUserValid(data: Omit<User, 'id'>): boolean {
  return (
    !data.username ||
    typeof data.age !== 'number' ||
    !Array.isArray(data.hobbies)
  )
}