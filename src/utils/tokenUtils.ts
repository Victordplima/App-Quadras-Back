import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'quadrasmaneiras123';

export const gerarToken = (userId: string, nome: string, email: string) => {
    return jwt.sign({ userId, nome, email }, SECRET, { expiresIn: '1h' });
};
