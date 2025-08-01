import { UpdateUserInput, User } from "@/@types/user";
import { UsersRepository } from "../repositories/user-repository";
import { ResourceNotFoundError, UserAlreadyExistsError } from "../errors/err";
import { hashPassword } from "@/utils/hash-password";

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
        throw new UserAlreadyExistsError();
      }

      user.email = dto.email; // Update the email in the user object
    }

    if (dto.name) {
      user.name = dto.name; // Update the name in the user object
    }

    if (dto.password) {
      const passwordHashed = await hashPassword(dto.password);
      user.password = passwordHashed; // Update the password in the user object
    }

    const updatedUser = await this.UsersRepository.update(id, user);

    return {
      updatedUser,
    };
  }
}
