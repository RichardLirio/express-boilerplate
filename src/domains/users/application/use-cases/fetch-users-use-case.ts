import { User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";

interface FetchUserUseCaseResponse {
  Users: Omit<User, "password">[];
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
