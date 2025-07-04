import { User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { ResourceNotFoundError } from "../errors/err";

interface DeleteUserUseCaseParams {
  id: string;
}

interface DeleteUserUseCaseResponse {
  User: Partial<User>;
}

export class DeleteUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    id,
  }: DeleteUserUseCaseParams): Promise<DeleteUserUseCaseResponse> {
    const User = await this.UsersRepository.delete(id);

    if (!User) {
      throw new ResourceNotFoundError();
    }

    return {
      User,
    };
  }
}
