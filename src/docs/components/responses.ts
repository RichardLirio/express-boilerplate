/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Token de acesso ausente ou inválido
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *
 *     ForbiddenError:
 *       description: Acesso negado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *
 *     NotFoundError:
 *       description: Recurso não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *
 *     ValidationError:
 *       description: Erro de validação
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *
 *     ServerError:
 *       description: Erro interno do servidor
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
