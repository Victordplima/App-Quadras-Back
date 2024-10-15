import { db } from '../database/db';
import { ResultSetHeader } from 'mysql2';

// Função para criar um novo usuário no banco de dados
export const criarUsuario = async (
    nome: string,
    email: string,
    senha: string,
    telefone: string,
    matricula: string,
    curso: string,
    role: string
) => {
    const query = `
        INSERT INTO usuario (nome, email, senha, telefone, matricula, curso, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute<ResultSetHeader>(query, [
        nome,
        email,
        senha,
        telefone,
        matricula,
        curso,
        role,
    ]);

    // Verifique o insertId do resultado
    return { id: result.insertId, nome, email };
};

// Função para encontrar um usuário pelo email
export const encontrarUsuarioPorEmail = async (email: string) => {
    const query = 'SELECT * FROM usuario WHERE email = ?';
    const [rows] = await db.execute<any[]>(query, [email]); // Aqui, assumimos que rows é um array de resultados
    return rows[0];  // Retorna o usuário encontrado ou undefined se não encontrado
};

// Função para validar a senha (usando bcrypt ou outro método)
export const validarSenha = async (senha: string, senhaHash: string) => {
    // Aqui você pode usar bcrypt para comparar senhas (supondo que esteja usando hash)
    // Exemplo: return bcrypt.compare(senha, senhaHash);
    return senha === senhaHash;  // Comparação simples (a ser substituída por algo mais seguro)
};
