import { CreateUserInput, User } from "@/@types/user";
import { UsersRepository } from "@/domains/users/application/repositories/user-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findAll(): Promise<Omit<User, "password">[]> {
    const Users = this.items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return Users;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: CreateUserInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(user);

    return { ...user, password: undefined };
  }

  async delete(id: string): Promise<Partial<User> | null> {
    const user = this.items.find((item) => item.id === id); // Encontra o usuário pelo ID

    if (!user) {
      return null; // Se o usuário não for encontrado, retorna null
    }

    const userIndex = this.items.findIndex((item) => item.id === id); // Encontra o índice do usuário na lista de usuários

    this.items.splice(userIndex, 1); // Remove o usuário da lista de usuários em memória

    return { ...user, password: undefined }; // Exclude password from the returned user
  }

  async update(id: string, user: User): Promise<User> {
    // Encontra o índice do usuário na lista
    const userIndex = this.items.findIndex((item) => item.id === id);

    // Substitui o usuário na lista
    this.items[userIndex] = user;

    // Retorna o usuário atualizado
    return this.items[userIndex];
  }
}
