import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UsuarioModelo } from '../models/userModel';

export const verificarAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const usuario: UsuarioModelo | undefined = req.usuario;

    if (usuario && usuario.role === 'admin') {
        return next(); // Chama o próximo middleware ou rota
    }

    // Envia a resposta de erro sem retornar explicitamente um Response
    res.status(403).json({ mensagem: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
};
