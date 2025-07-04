import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/user-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteUserUseCase } from "./delete-user-use-case";
import { ResourceNotFoundError } from "../errors/err";

let userRepository: UsersRepository;
let sut: DeleteUserUseCase;

describe("Delete User Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(userRepository);
  }); // Cria uma nova instância do repositório de usuários e do caso de uso antes de cada teste

  // Testes do caso de uso
  it("is possible to Delete user by id", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    if (createdUser.id) {
      await sut.execute({ id: createdUser.id });

      const user = await userRepository.findById(createdUser.id);

      expect(user).toBeNull();
    }
  });

  it("should not be possible to Delete user with invalid id", async () => {
    await expect(() =>
      sut.execute({ id: "invalid-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
