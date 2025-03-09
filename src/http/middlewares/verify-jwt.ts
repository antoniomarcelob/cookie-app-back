import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.accessTokenVerify()
  } catch (err) {
      try {
        await request.refreshTokenVerify();
        const user: {
          sub: string,
          username: string,
        } = await request.accessTokenDecode()

        const newAccessToken = await reply.accessTokenSign(
          {
            sub: user.sub,
            username: user.username
          },
        )

        const refreshToken = await reply.refreshTokenSign(
          { sub: user.sub },
        )
  
        return reply
          .setCookie('accessToken', newAccessToken, {
            path: '/',
            secure: false,
            sameSite: 'strict',
            httpOnly: true,
            signed: true
          })
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: false,
            sameSite: 'strict',
            httpOnly: true,
            signed: true
          })
          .status(200)
          .send()

      } catch(err) {
        return reply.status(401).send({ message: 'Unauthorized.' })
      }
  }
}
