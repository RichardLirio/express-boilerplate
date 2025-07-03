export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    const normalizedEmail = email.toLowerCase().trim();

    if (!this.isValid(normalizedEmail)) {
      throw new Error("Invalid email format");
    }

    return new Email(normalizedEmail);
  }

  getValue(): string {
    return this.value;
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
