import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserUseCase } from "../application/use-cases/get-user-use-case";

export function makeGetUserUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const GetUseCase = new GetUserUseCase(UserRepository);

  return GetUseCase; // Retorna uma instância do caso de uso
}
