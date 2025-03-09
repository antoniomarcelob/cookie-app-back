import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { AuthenticateUserUseCase } from "../../use-cases/authenticate-user.user-case";
import { InvalidCredentialsError } from "../../use-cases/Errors/invalid-credentials-error";

export default async function AuthenticateUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const AuthenticateUserBodySchema = z.object({
    username: z.string().min(3),
    password: z.string().min(4),
  });

  const { password, username } = AuthenticateUserBodySchema.parse(request.body);
  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository
    );

    const { user } = await authenticateUserUseCase.execute({
      password,
      username,
    });

    const accessToken = await reply.accessTokenSign({
      sub: user.userId,
      username: user.username,
    });

    const refreshToken = await reply.refreshTokenSign({ sub: user.userId });

    return reply
      .setCookie("accessToken", accessToken).setCookie("refreshToken", refreshToken)
      .status(200)
      .send({ message: "You were successfuly logged in." });

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: "invalid credentials" });    
    }

    return reply.status(500).send({ message: "Erro desconhecido" });
  }
}
