import { User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { ResourceNotFoundError } from "../errors/err";

interface GetUserUseCaseParams {
  id: string;
}

interface GetUserUseCaseResponse {
  User: User;
}

export class GetUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({ id }: GetUserUseCaseParams): Promise<GetUserUseCaseResponse> {
    const User = await this.UsersRepository.findById(id);

    if (!User) {
      throw new ResourceNotFoundError();
    }

    return {
      User,
    };
  }
}
