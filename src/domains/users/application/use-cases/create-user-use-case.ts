import { CreateUserInput, User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { UserAlreadyExistsError } from "../errors/err";
import { hash } from "bcryptjs";

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

    const passwordHash = await hash(password, 10); // hashe da senha

    const User = await this.UsersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return {
      User,
    };
  }
}
