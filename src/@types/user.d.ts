export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Armazenar hash da senha, não a senha em texto claro
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para criação de usuário
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

// Tipo de autenticação de usuário
export interface AuthenticateUserInput {
  email: string;
  password: string;
}

// Tipo para atualização de usuário (campos opcionais)
export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}
