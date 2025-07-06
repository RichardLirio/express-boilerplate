import { Request, Response, NextFunction } from "express";

// Armazenamento em memória (em produção, use Redis)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Função para obter o identificador do cliente
const getClientId = (req: Request): string => {
  // Prioridade: IP real > IP do proxy > IP da conexão
  const forwarded = req.headers["x-forwarded-for"] as string;
  const ip = forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
  return ip || "unknown";
};

// Middleware de rate limiting genérico
export const rateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxRequests,
    blockDuration = 15 * 60 * 1000, // 15 minutos por padrão
    message = "Too many requests, please try again later",
    skipSuccessful = false,
    keyPrefix = "default",
    skipIfAlreadyLimited = false,
  } = options;

  return (
    req: Request & { rateLimitApplied?: boolean },
    res: Response,
    next: NextFunction
  ) => {
    // Se já foi aplicado rate limiting e esta configuração deve ser pulada
    if (skipIfAlreadyLimited && req.rateLimitApplied) {
      return next();
    }

    const clientId = getClientId(req);
    const storeKey = `${keyPrefix}:${clientId}`;
    const now = Date.now();

    let record = rateLimitStore.get(storeKey);

    // Se não existe registro ou a janela expirou, criar novo
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs,
        blocked: false,
      };
    }

    // Verificar se ainda está bloqueado
    if (record.blocked && record.blockExpiry && now < record.blockExpiry) {
      const remainingTime = Math.ceil((record.blockExpiry - now) / 1000);
      return res.status(429).json({
        error: "IP temporarily blocked",
        retryAfter: remainingTime,
        type: keyPrefix,
      });
    }

    // Resetar bloqueio se expirou
    if (record.blocked && record.blockExpiry && now >= record.blockExpiry) {
      record.blocked = false;
      record.blockExpiry = undefined;
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    // Incrementar contador
    record.count++;

    // Verificar se excedeu o limite
    if (record.count > maxRequests) {
      record.blocked = true;
      record.blockExpiry = now + blockDuration;

      rateLimitStore.set(storeKey, record);

      const remainingTime = Math.ceil(blockDuration / 1000);
      return res.status(429).json({
        error: message,
        retryAfter: remainingTime,
        type: keyPrefix,
      });
    }

    // Salvar registro atualizado
    rateLimitStore.set(storeKey, record);

    // Adicionar headers informativos (apenas se não foram adicionados antes)
    if (!res.get("X-RateLimit-Limit")) {
      res.set({
        "X-RateLimit-Limit": maxRequests.toString(),
        "X-RateLimit-Remaining": (maxRequests - record.count).toString(),
        "X-RateLimit-Reset": new Date(record.resetTime).toISOString(),
        "X-RateLimit-Type": keyPrefix,
      });
    }

    // Marcar que rate limiting foi aplicado
    req.rateLimitApplied = true;

    // Se skipSuccessful estiver ativado, decrementar em caso de sucesso
    if (skipSuccessful) {
      const originalSend = res.send;
      res.send = function (data) {
        if (res.statusCode < 400) {
          record!.count--;
          rateLimitStore.set(storeKey, record!);
        }
        return originalSend.call(this, data);
      };
    }

    next();
  };
};

// Rate limiters específicos com prefixos únicos
export const authRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // 5 tentativas de login por 15 minutos
  blockDuration: 30 * 60 * 1000, // Bloquear por 30 minutos
  message: "Too many login attempts, please try again in 30 minutes",
  skipSuccessful: true, // Só contar tentativas de login falhadas
  keyPrefix: "auth",
});

export const generalRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // 100 requisições por 15 minutos
  message: "Too many requests, please try again later",
  keyPrefix: "general",
  skipIfAlreadyLimited: true, // Pular se já foi aplicado rate limiting específico
});

export const strictRateLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 10, // 10 requisições por minuto
  blockDuration: 5 * 60 * 1000, // Bloquear por 5 minutos
  message: "Request limit exceeded",
  keyPrefix: "strict",
});

// Middleware específico para diferentes tipos de operação
export const apiRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  maxRequests: 50, // 50 requisições por 5 minutos
  message: "API limit exceeded",
  keyPrefix: "api",
});

// Limpeza automática de registros expirados
export const cleanupRateLimitStore = (): void => {
  const now = Date.now();
  for (const [storeKey, record] of rateLimitStore.entries()) {
    if (now > record.resetTime && !record.blocked) {
      rateLimitStore.delete(storeKey);
    }
  }
};

// Executar limpeza a cada 5 minutos
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

// Middleware para logging de rate limiting
export const rateLimitLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientId = getClientId(req);

  // Log para diferentes tipos de rate limiting
  const authRecord = rateLimitStore.get(`auth:${clientId}`);
  const generalRecord = rateLimitStore.get(`general:${clientId}`);

  if (authRecord && authRecord.count > 0) {
    console.log(`Rate limit AUTH: ${clientId} - ${authRecord.count} requests`);
  }

  if (generalRecord && generalRecord.count > 0) {
    console.log(
      `Rate limit GENERAL: ${clientId} - ${generalRecord.count} requests`
    );
  }

  next();
};

// Middleware para verificar status de rate limiting
export const getRateLimitStatus = (req: Request, res: Response) => {
  const clientId = getClientId(req);

  const authRecord = rateLimitStore.get(`auth:${clientId}`);
  const generalRecord = rateLimitStore.get(`general:${clientId}`);

  const status = {
    ip: clientId,
    auth: authRecord
      ? {
          count: authRecord.count,
          remaining: Math.max(0, 5 - authRecord.count),
          resetTime: new Date(authRecord.resetTime).toISOString(),
          blocked: authRecord.blocked,
          blockExpiry: authRecord.blockExpiry
            ? new Date(authRecord.blockExpiry).toISOString()
            : null,
        }
      : null,
    general: generalRecord
      ? {
          count: generalRecord.count,
          remaining: Math.max(0, 100 - generalRecord.count),
          resetTime: new Date(generalRecord.resetTime).toISOString(),
          blocked: generalRecord.blocked,
          blockExpiry: generalRecord.blockExpiry
            ? new Date(generalRecord.blockExpiry).toISOString()
            : null,
        }
      : null,
  };

  res.json(status);
};

// Middleware para resetar rate limiting (apenas para desenvolvimento/admin)
export const resetRateLimit = (req: Request, res: Response) => {
  const { ip, type } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP is mandatory" });
  }

  if (type) {
    const key = `${type}:${ip}`;
    rateLimitStore.delete(key);
    return res.json({ message: `Rate limit reset to ${type}:${ip}` });
  } else {
    // Resetar todos os tipos para o IP
    const keys = Array.from(rateLimitStore.keys()).filter((key) =>
      key.endsWith(`:${ip}`)
    );
    keys.forEach((key) => rateLimitStore.delete(key));
    return res.json({ message: `All rate limits reset to ${ip}` });
  }
};
