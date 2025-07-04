export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists");
  }
}

export class ResourceNotFoundError extends Error {
  constructor() {
    super("Resource not found");
  }
}

export class EmailalreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
  }
}
