import { CreateUserInput, User } from "@/@types/user";

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<Partial<User>>;
  findAll(): Promise<Partial<User>[]>;
}
