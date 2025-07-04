import { CreateUserUseCase } from "@/domains/user/application/use-cases/create-user-use-case";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeCreateUserUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const CreateUseCase = new CreateUserUseCase(UserRepository);

  return CreateUseCase; // Retorna uma instância do caso de uso
}
