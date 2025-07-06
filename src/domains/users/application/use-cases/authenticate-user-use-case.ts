import { AuthenticateUserInput, User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { InvalidCredentialsError, UserDoesNotExistError } from "../errors/err";
import { comparePassword } from "@/utils/compare-password";

interface AuthenticateUserUseCaseResponse {
  User: Partial<User>;
}

export class AuthenticateUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserInput): Promise<AuthenticateUserUseCaseResponse> {
    const User = await this.UsersRepository.findByEmail(email);

    if (!User) {
      throw new UserDoesNotExistError();
    }

    const passwordIsValid = await comparePassword(password, User.password);

    if (!passwordIsValid) {
      throw new InvalidCredentialsError();
    }

    return { User: { ...User, password: undefined } };
  }
}
