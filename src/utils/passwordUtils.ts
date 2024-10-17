import bcrypt from 'bcryptjs';

export const hashSenha = async (senha: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
};

export const validarSenha = async (senha: string, senhaHash: string): Promise<boolean> => {
    return bcrypt.compare(senha, senhaHash);
};
