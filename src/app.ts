import Fastify from "fastify";
import { AppRoutes } from "./http/routes";
import { ZodError } from "zod";
import cors from '@fastify/cors'
import fastifyJwt, { FastifyJwtNamespace } from "@fastify/jwt";
import { env } from "./env";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'refreshToken' }> {}
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'accessToken' }> {}

  interface FastifyRequest {
    // Custom namespace
    refreshTokenVerify: FastifyRequest['jwtVerify'],
    refreshTokenDecode: FastifyRequest['jwtDecode'],
    accessTokenVerify: FastifyRequest['jwtVerify'],
    accessTokenDecode: FastifyRequest['jwtDecode'],
  }
  interface FastifyReply {
    // Custom namespace
    accessTokenSign: FastifyReply['jwtSign'],
    refreshTokenSign: FastifyReply['jwtSign'],
  }
}

export const app = Fastify()

app.register(AppRoutes)

app.register(cors, {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(fastifyCookie, {
  secret: [env.JWT_SECRET],
  parseOptions: {
    path: "/",
    secure: false,
    httpOnly: true,
    sameSite: "lax",
    signed: true,
  },
  hook: 'onRequest'
} as FastifyCookieOptions)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  namespace: 'accessToken',
  jwtVerify: 'accessTokenVerify',
  jwtSign: 'accessTokenSign',
  jwtDecode: 'accessTokenDecode',
  cookie: {
    cookieName: 'accessToken',
    signed: true,
  },
  sign: {
    expiresIn: '15m',
  },
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  namespace: 'refreshToken',
  jwtVerify: 'refreshTokenVerify',
  jwtSign: 'refreshTokenSign',
  cookie: {
    cookieName: 'refreshToken',
    signed: true,
  },
  sign: {
    expiresIn: '1d',
  },
})

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation errors.', issues: error.format() })
    }
  
    return reply.status(500).send({ message: 'Internal server error.' })
  })