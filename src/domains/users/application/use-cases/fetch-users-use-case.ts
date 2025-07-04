import { User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";

interface FetchUserUseCaseResponse {
  Users: Partial<User>[];
}

export class FetchUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute(): Promise<FetchUserUseCaseResponse> {
    const Users = await this.UsersRepository.findAll();

    return {
      Users,
    };
  }
}
