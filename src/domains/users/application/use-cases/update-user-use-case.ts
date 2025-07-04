import { UpdateUserInput, User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { EmailalreadyExistsError, ResourceNotFoundError } from "../errors/err";

interface UpdateUserUseCaseResponse {
  updatedUser: User;
}

export class UpdateUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute(
    id: string,
    dto: UpdateUserInput
  ): Promise<UpdateUserUseCaseResponse> {
    const user = await this.UsersRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (dto.email && dto.email !== user.email) {
      const userWithSameEmail = await this.UsersRepository.findByEmail(
        dto.email
      );

      if (userWithSameEmail) {
        throw new EmailalreadyExistsError();
      }

      user.email = dto.email; // Update the email in the user object
    }

    if (dto.name) {
      user.name = dto.name; // Update the name in the user object
    }

    if (dto.password) {
      user.password = dto.password; // Update the password in the user object
    }

    const updatedUser = await this.UsersRepository.update(id, user);

    return {
      updatedUser,
    };
  }
}
