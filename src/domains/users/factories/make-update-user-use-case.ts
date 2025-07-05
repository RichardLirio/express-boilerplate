import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateUserUseCase } from "../application/use-cases/update-user-use-case";

export function makeUpdateUserUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const updateUserUseCase = new UpdateUserUseCase(UserRepository);

  return updateUserUseCase; // Retorna uma instância do caso de uso
}
