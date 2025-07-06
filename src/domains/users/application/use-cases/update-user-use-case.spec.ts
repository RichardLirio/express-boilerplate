import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/user-repository";
import { UpdateUserUseCase } from "./update-user-use-case";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { ResourceNotFoundError, UserAlreadyExistsError } from "../errors/err";
import { comparePassword } from "@/utils/compare-password";

let userRepository: UsersRepository;
let sut: UpdateUserUseCase;

describe("Update User Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new UpdateUserUseCase(userRepository);
  }); // Cria uma nova instância do repositório de usuários e do caso de uso antes de cada teste

  // Testes do caso de uso
  it("is possible to update a user", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { updatedUser } = await sut.execute(user.id, {
      name: "John Doe Updated",
      email: "johndoupdate@example.com",
      password: "12345678",
    });

    expect(updatedUser.id).toEqual(expect.any(String));
    expect(updatedUser.name).toEqual("John Doe Updated");
    expect(updatedUser.email).toEqual("johndoupdate@example.com");
    expect(updatedUser.password).toEqual(expect.any(String));
  });

  // Testa se o usuário não pode ser atualizado com um email ja existente
  it("should not be possible to Update a user with the email already exist", async () => {
    const email = "johndoe@example.com";

    await userRepository.create({
      name: "John Doe",
      email: email,
      password: "123456",
    });

    const user = await userRepository.create({
      name: "John Doe 2",
      email: "johndoexample@example.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute(user.id, {
        name: "John Doe 2 updated",
        email: email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should not be possible to update user with invalid id", async () => {
    await expect(() =>
      sut.execute("invalid-id", {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("is possible to update only user name", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { updatedUser } = await sut.execute(user.id, {
      name: "John Doe Updated",
    });

    expect(updatedUser.id).toEqual(expect.any(String));
    expect(updatedUser.name).toEqual("John Doe Updated");
    expect(updatedUser.email).toEqual("johndoe@example.com");
    expect(updatedUser.password).toEqual("123456");
  });

  it("is possible to update only user email", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { updatedUser } = await sut.execute(user.id, {
      email: "johndoupdate@example.com",
    });

    expect(updatedUser.id).toEqual(expect.any(String));
    expect(updatedUser.name).toEqual("John Doe");
    expect(updatedUser.email).toEqual("johndoupdate@example.com");
    expect(updatedUser.password).toEqual("123456");
  });

  it("is possible to update only user password", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { updatedUser } = await sut.execute(user.id, {
      password: "123456789",
    });

    expect(updatedUser.id).toEqual(expect.any(String));
    expect(updatedUser.name).toEqual("John Doe");
    expect(updatedUser.email).toEqual("johndoe@example.com");
    expect(await comparePassword("123456789", updatedUser.password)).toEqual(
      true
    );
  });
});
