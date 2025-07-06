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

export class UserDoesNotExistError extends Error {
  constructor() {
    super("User does not exist");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
  }
}
