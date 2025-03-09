import { Prisma, Users } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { prisma } from "../../lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
  async createUser(newUser: Prisma.UsersCreateInput) {
    const user = await prisma.users.create({
      data: newUser,
    });

    return user;
  }

  async findUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: {
        user_id: userId,
      },
    });

    return user;
  }

  async findUserByUsername(username: string) {
    const user = await prisma.users.findUnique({
      where: {
        user_name: username,
      },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: {
        user_email: email,
      },
    });

    return user;
  }

  async authenticate(username: string) {
    const user = await prisma.users.findFirst({
      where: {
        user_name: username,
      },
    });

    return user;
  }
}
