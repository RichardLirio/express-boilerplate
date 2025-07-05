import { CreateUserInput, User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { UserAlreadyExistsError } from "../errors/err";

interface CreateUserUseCaseResponse {
  User: Partial<User>;
}

export class CreateUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserInput): Promise<CreateUserUseCaseResponse> {
    const userExists = await this.UsersRepository.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const User = await this.UsersRepository.create({
      name,
      email,
      password,
    });

    return {
      User,
    };
  }
}
