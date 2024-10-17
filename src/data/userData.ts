import pool from '../database/db';
import { QueryResult } from 'pg';

export const criarUsuarioDB = async (
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, nome, email;  -- Retorna id, nome e email do novo usuário
    `;
    const values = [nome, email, senha, telefone, matricula, curso, role];
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0];
};



export const encontrarUsuarioPorEmailDB = async (email: string) => {
    const query = 'SELECT * FROM usuario WHERE email = $1';
    const result: QueryResult = await pool.query(query, [email]);
    return result.rows[0];
};



export const editarUsuarioDB = async (
    id: string,
    nome: string,
    email: string,
    telefone: string,
    matricula: string,
    curso: string,
    role: string
) => {
    const query = `
        UPDATE usuario
        SET nome = $1, email = $2, telefone = $3, matricula = $4, curso = $5, role = $6
        WHERE id = $7
        RETURNING id;  -- Retorna o id do usuário atualizado
    `;
    const values = [nome, email, telefone, matricula, curso, role, id];
    const result: QueryResult = await pool.query(query, values);

    if (result.rowCount !== null && result.rowCount > 0) {
        return true;
    }
    return false;
};



export const deletarUsuarioDB = async (id: string) => {
    const query = 'DELETE FROM usuario WHERE id = $1 RETURNING id';
    const result: QueryResult = await pool.query(query, [id]);

    if (result.rowCount !== null && result.rowCount > 0) {
        return true;
    }
    return false;
};



export const encontrarUsuarioPorIdDB = async (id: string) => {
    const query = 'SELECT * FROM usuario WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0];
};



export const listarUsuariosDB = async () => {
    const query = 'SELECT * FROM usuario';
    const result: QueryResult = await pool.query(query);
    return result.rows;
};
