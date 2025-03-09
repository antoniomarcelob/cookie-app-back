import { FastifyInstance } from "fastify";
import RegisterUserController from "./controllers/register-user.controller";
import AuthenticateUserController from "./controllers/authenticate-user.controller";
import ProfileController from "./controllers/profile.controller";
import { verifyJwt } from "./middlewares/verify-jwt";

export async function AppRoutes(app: FastifyInstance) {

  // app.addHook('onRequest', verifyJwt)
  app.post("/api/users/register", RegisterUserController);
  app.post("/api/users/signin", AuthenticateUserController);


  app.get("/api/profile/me", {onRequest: verifyJwt}, ProfileController);
}
