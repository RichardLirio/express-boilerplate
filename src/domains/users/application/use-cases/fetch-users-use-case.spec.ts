import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/user-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FetchUserUseCase } from "./fetch-users-use-case";

let userRepository: UsersRepository;
let sut: FetchUserUseCase;

describe("Fetch User Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new FetchUserUseCase(userRepository);
  }); // Cria uma nova instância do repositório de usuários e do caso de uso antes de cada teste

  // Testes do caso de uso de listagem de users
  it("is possible to fetch all users", async () => {
    const User = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const User2 = await userRepository.create({
      name: "John Doe 2",
      email: "johndo2@example.com",
      password: "123456",
    });

    const { Users } = await sut.execute();

    expect(Users).toHaveLength(2);
    expect(Users).toEqual([
      expect.objectContaining({ name: User.name }),
      expect.objectContaining({ name: User2.name }),
    ]);
  });
});
