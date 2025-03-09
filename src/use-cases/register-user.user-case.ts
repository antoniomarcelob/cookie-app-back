import { hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyRegisteredError } from "./Errors/user-already-registered-error";

interface RegisterUserUseCaseData {
  username: string;
  password: string;
  email: string;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password, username }: RegisterUserUseCaseData) {
    try {
      const userWithSameEmail = await this.usersRepository.findUserByEmail(
        email
      );
      const userWithSameUsername =
        await this.usersRepository.findUserByUsername(username);

      if (userWithSameEmail || userWithSameUsername) {
        throw new UserAlreadyRegisteredError();
      }

      const psswrd_hash = await hash(password, 6);

      const registeredUser = await this.usersRepository.createUser({
        user_email: email,
        user_name: username,
        user_password: psswrd_hash,
      });

      return registeredUser;
    } catch (err) {
      throw new Error("Error registering user.");
    }
  }
}
