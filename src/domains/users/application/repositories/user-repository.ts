import { CreateUserInput, User } from "@/@types/user";

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<Omit<User, "password">>;
  findAll(): Promise<Omit<User, "password">[]>;
  delete(id: string): Promise<Partial<User> | null>;
  update(id: string, data: User): Promise<User>;
}
