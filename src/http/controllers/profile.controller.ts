import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../use-cases/Errors/unauthorized-error";

export default async function ProfileController(request: FastifyRequest, reply: FastifyReply) {
  try {
    let token = request.headers.authorization

    if (!token) {
      return reply.status(401).send({ message: "Usuário não autenticado" });
    }

    const decoded: { sub: string, username: string } = await request.accessTokenDecode();

    return reply.status(200).send({
      message: "Usuário está autenticado",
      user: {
        id: decoded.sub,
        username: decoded.username
      },
    });

  } catch (err) {
    if(err instanceof UnauthorizedError) {
      return reply.status(500).send({ message: "Unauthenticated user" });
    }
    
    return reply.status(500).send({ message: "Erro desconhecido" });
  }
}
