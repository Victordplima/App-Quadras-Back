import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'quadrasmaneiras123';

export const protegerRota = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado, token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ mensagem: 'Token inválido' });
    }
};
