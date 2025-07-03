// Tipo base para respostas da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipo para resposta de erro
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}

// Tipo para resposta de sucesso
export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}
