import { CreateUserInput, User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { UserAlreadyExistsError } from "../errors/err";
import { hashPassword } from "@/utils/hash-password";

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

    const passwordHashed = await hashPassword(password);

    const User = await this.UsersRepository.create({
      name,
      email,
      password: passwordHashed,
    });

    return {
      User,
    };
  }
}
