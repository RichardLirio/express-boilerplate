// Constantes da aplicação
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
  SUCCESS: "Operation carried out successfully",
  ERROR: "An internal error has occurred",
  NOT_FOUND: "Resource not found",
  INVALID_DATA: "Invalid data provided",
} as const;
