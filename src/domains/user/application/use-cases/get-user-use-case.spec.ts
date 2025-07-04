import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/user-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserUseCase } from "./get-user-use-case";
import { ResourceNotFoundError } from "../errors/err";

let userRepository: UsersRepository;
let sut: GetUserUseCase;

describe("Get User Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(userRepository);
  }); // Cria uma nova instância do repositório de usuários e do caso de uso antes de cada teste

  // Testes do caso de uso de listagem de users
  it("is possible to Get user by id", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    if (createdUser.id) {
      const { User } = await sut.execute({ id: createdUser.id });
      expect(User).toEqual(
        expect.objectContaining({
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        })
      );
    }
  });

  it("should not be possible to get user with invalid id", async () => {
    await expect(() =>
      sut.execute({ id: "invalid-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
