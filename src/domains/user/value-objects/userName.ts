export class UserName {
  private constructor(private readonly value: string) {}

  static create(name: string): UserName {
    const normalizedName = name.trim();

    if (!normalizedName || normalizedName.length < 2) {
      throw new Error("Name must have at least 2 characters");
    }

    if (normalizedName.length > 100) {
      throw new Error("Name cannot exceed 100 characters");
    }

    return new UserName(normalizedName);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }
}
