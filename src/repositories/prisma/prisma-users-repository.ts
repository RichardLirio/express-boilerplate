import { User, CreateUserInput } from "@/@types/user";
import { UsersRepository } from "@/domains/user/application/repositories/user-repository";
import prisma from "@/lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<Partial<User> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? { ...user, password: undefined } : null; // Exclude password from the returned user
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(data: CreateUserInput): Promise<Partial<User>> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  async findAll(): Promise<Partial<User>[]> {
    const users: Partial<User>[] = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true, // Incluindo updatedAt para manter consistência
      },
    });

    return users;
  }
}
