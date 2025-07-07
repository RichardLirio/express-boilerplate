import { Router } from "express";
import { authenticateUser } from "../controllers/auth/authenticate-user-controller";
import { authenticate } from "../middlewares/auth";
import { logoutUser } from "../controllers/auth/logout-user-controller";
import { apiRateLimit, authRateLimit } from "../middlewares/rate-limiter";
const authRoutes = Router();

// Definir rotas de autenticação

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
authRoutes.post("/login", authRateLimit, authenticateUser);

authRoutes.post("/logout", authenticate, apiRateLimit, logoutUser);

export default authRoutes;
