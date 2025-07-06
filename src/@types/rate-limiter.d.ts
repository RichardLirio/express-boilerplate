interface RateLimitRecord {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpiry?: number;
}

interface RateLimitOptions {
  windowMs: number; // Janela de tempo em milissegundos
  maxRequests: number; // Máximo de requisições por janela
  blockDuration?: number; // Duração do bloqueio em milissegundos
  message?: string; // Mensagem personalizada
  skipSuccessful?: boolean; // Contar apenas requisições com erro
  keyPrefix?: string; // Prefixo para diferenciar diferentes tipos de rate limit
  skipIfAlreadyLimited?: boolean; // Pular se já foi limitado por outro middleware
}
