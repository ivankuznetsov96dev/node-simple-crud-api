import { User } from "../interfaces/user.interface";

export function isUserValid(data: Omit<User, 'id'>): data is Omit<User, 'id'> {
  return (
    !data.username ||
    typeof data.age !== 'number' ||
    !Array.isArray(data.hobbies)
  )
}