import { compare, hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./Errors/invalid-credentials-error";

interface AuthenticateUserUseCaseData {
  username: string;
  password: string;
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ password, username }: AuthenticateUserUseCaseData) {
    const user = await this.usersRepository.authenticate(username);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.user_password);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user: {
        userId: user.user_id,
        username: user.user_name,
        userEmail: user.user_email,
      },
    };
  }
}
