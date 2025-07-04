import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateUserUseCase } from "../application/use-cases/create-user-use-case";

export function makeCreateUserUseCase() {
  const UserRepository = new PrismaUsersRepository();
  const CreateUseCase = new CreateUserUseCase(UserRepository);

  return CreateUseCase; // Retorna uma instância do caso de uso
}
