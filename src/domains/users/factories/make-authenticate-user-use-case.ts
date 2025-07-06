import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUserUseCase } from "../application/use-cases/authenticate-user-use-case";

export function makeAuthenticateUserUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const AuthenticateUseCase = new AuthenticateUserUseCase(UserRepository);

  return AuthenticateUseCase; // Retorna uma instância do caso de uso
}
