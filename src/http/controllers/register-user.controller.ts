import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { RegisterUserUseCase } from "../../use-cases/register-user.user-case";

export default async function RegisterUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const RegisterUserBodySchema = z.object({
    username: z.string().min(3),
    password: z.string().min(4),
    email: z.string().email(),
  });

  const { email, password, username } = RegisterUserBodySchema.parse(
    request.body
  );

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUserUseCase = new RegisterUserUseCase(usersRepository);

    await registerUserUseCase.execute({ email, password, username });

    return reply.status(200).send({ message: "User successfully registered." });
  } catch (err) {
    return reply.status(500).send({ message: "User registering failed." });
  }
}
