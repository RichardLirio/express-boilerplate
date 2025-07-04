import { CreateUserInput, User } from "@/@types/user";

export interface UsersRepository {
  findById(id: string): Promise<Partial<User> | null>;
  findByEmail(email: string): Promise<Partial<User> | null>;
  create(data: CreateUserInput): Promise<Partial<User>>;
  findAll(): Promise<Partial<User>[]>;
}
