import { Prisma, Users } from "@prisma/client";

export interface UsersRepository {
  createUser(newUser: Prisma.UsersCreateInput): Promise<Users>;
  findUserById(userId: string): Promise<Users | null>;
  findUserByUsername(username: string): Promise<Users | null>;
  findUserByEmail(email: string): Promise<Users | null>;
  authenticate(username: string): Promise<Users | null>;
}
