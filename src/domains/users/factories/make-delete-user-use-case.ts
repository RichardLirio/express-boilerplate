import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteUserUseCase } from "../application/use-cases/delete-user-use-case";

export function makeDeleteUserUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const deleteUserUseCase = new DeleteUserUseCase(UserRepository);

  return deleteUserUseCase; // Retorna uma instância do caso de uso
}
