import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'quadrasmaneiras123';

export const gerarToken = (userId: string, nome: string, email: string, role: string) => {
    return jwt.sign({ userId, nome, email, role }, SECRET, { expiresIn: '1h' });
};
