import { CreateUserInput, User } from "@/@types/user";
import { UsersRepository } from "@/domains/user/application/repositories/user-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findAll(): Promise<Partial<User>[]> {
    const Users: Partial<User>[] = this.items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return Users;
  }

  async findById(id: string): Promise<Partial<User> | null> {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return { ...user, password: undefined }; // Exclude password from the returned user
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
}
