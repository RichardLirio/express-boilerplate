import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/user-repository";
import { CreateUserUseCase } from "./create-user-use-case";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UserAlreadyExistsError } from "../errors/err";

let userRepository: UsersRepository;
let sut: CreateUserUseCase;

describe("Create User Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(userRepository);
  }); // Cria uma nova instância do repositório de usuários e do caso de uso antes de cada teste

  // Testes do caso de uso de criação de usuário
  it("is possible to register a user", async () => {
    const { User } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(User.id).toEqual(expect.any(String));
    expect(User.createdAt).toEqual(expect.any(Date));
    expect(User.password).toBeUndefined(); // Verifica se a senha não está presente no retorno
  });

  // Testa se o usuário não pode ser criado com o mesmo email
  it("should not be possible to create a user with the same email", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "John Doe",
      email: email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe2",
        email: email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
