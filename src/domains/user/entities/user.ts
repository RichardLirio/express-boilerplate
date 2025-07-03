import { randomUUID } from "crypto";

export class User {
  private constructor(
    private readonly id: string,
    private name: string,
    private email: string,
    private passwordHash: string,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  // Factory method para criar novo usuário
  static create(props: {
    name: string;
    email: string;
    passwordHash: string;
  }): User {
    const now = new Date();
    return new User(
      randomUUID(),
      props.name,
      props.email,
      props.passwordHash,
      now,
      now
    );
  }

  // Factory method para recriar usuário do banco
  static fromPersistence(props: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.passwordHash,
      props.createdAt,
      props.updatedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Métodos de negócio
  changeName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error("Name must have at least 2 characters");
    }
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  changeEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new Error("Invalid email format");
    }
    this.email = newEmail.toLowerCase();
    this.updatedAt = new Date();
  }

  changePassword(newPasswordHash: string): void {
    if (!newPasswordHash) {
      throw new Error("Password hash is required");
    }
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }

  // Validações de domínio
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Método para serialização
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
