import { User, CreateUserInput } from "@/@types/user";
import { UsersRepository } from "@/domains/users/application/repositories/user-repository";
import prisma from "@/lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? user : null; // Exclude password from the returned user
  }

  async findByEmail(email: string): Promise<Omit<User, "password"> | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true, // Incluindo updatedAt para manter consistência
      },
    });
    if (!user) {
      return null; // If user not found, return null
    }
    return { ...user };
  }

  async create(data: CreateUserInput): Promise<Omit<User, "password">> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return { ...user };
  }

  async findAll(): Promise<Omit<User, "password">[]> {
    const users = await prisma.user.findMany({
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

  async delete(id: string): Promise<Partial<User> | null> {
    const user = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true, // Incluindo updatedAt para manter consistência
      },
    });

    return user ? { ...user } : null; // Exclude password from the returned user
  }

  async update(id: string, data: User): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return updatedUser; // Return the updated user
  }
}
