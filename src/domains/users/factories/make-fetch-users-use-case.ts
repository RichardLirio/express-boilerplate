import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FetchUserUseCase } from "../application/use-cases/fetch-users-use-case";

export function makeFetchUsersUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const fetchUserUseCase = new FetchUserUseCase(UserRepository);

  return fetchUserUseCase; // Retorna uma instância do caso de uso
}
