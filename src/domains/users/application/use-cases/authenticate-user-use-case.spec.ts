import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/user-repository";
import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InvalidCredentialsError, UserDoesNotExistError } from "../errors/err";
import { hashPassword } from "@/utils/hash-password";

let userRepository: UsersRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserUseCase(userRepository);
  }); // Cria uma nova instância do repositório de usuários e do caso de uso antes de cada teste

  // Testes do caso de uso
  it("is possible to authenticate a user", async () => {
    const password = await hashPassword("123456");
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password,
    });

    const { User } = await sut.execute({
      email: user.email,
      password: "123456",
    });

    expect(User.id).toEqual(user.id);
    expect(User.name).toEqual(user.name);
    expect(User.email).toEqual(user.email);
  });

  // Testa se o email está registrado e retorna um erro especifico
  it("should not be possible to authenticate a user with an unregistered email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserDoesNotExistError);
  });

  // Testa se o password está valido e retorna um erro especifico
  it("should not be possible to authenticate a user with an invalid password", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "345678",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
