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
        RETURNING id, nome, email;
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
        RETURNING id;
    `;
    const values = [nome, email, telefone, matricula, curso, role, id];
    const result: QueryResult = await pool.query(query, values);

    if (result?.rowCount && result.rowCount > 0) {
        return true;
    }
    return false;
};



export const deletarUsuarioDB = async (id: string) => {
    const query = 'DELETE FROM usuario WHERE id = $1 RETURNING id';
    const result: QueryResult = await pool.query(query, [id]);

    if (result?.rowCount && result.rowCount > 0) {
        return true;
    }
    return false;
};



export const encontrarUsuarioPorIdDB = async (id: string) => {
    const query = 'SELECT id, nome, email, telefone, matricula, curso, role, bloqueado FROM usuario WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0];
};



export const listarUsuariosDB = async () => {
    const query = 'SELECT id, nome, email, telefone, matricula, curso, role, bloqueado FROM usuario';
    const result: QueryResult = await pool.query(query);
    return result.rows;
};



export const buscarHistoricoUsuarioDB = async (id: string) => {
    const query = `
        SELECT 
            u.id AS usuario_id, u.nome, u.email, u.telefone, u.matricula, u.curso, u.role, u.bloqueado,
            r.id AS reserva_id, r.quadra_id, r.data, r.hora_inicio, r.hora_fim, r.status, r.data_criacao, r.hora_criacao
        FROM 
            usuario u
        LEFT JOIN 
            reserva r ON u.id = r.usuario_id
        WHERE 
            u.id = $1;
    `;
    const result: QueryResult = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        return null;
    }

    const user = {
        id: result.rows[0].usuario_id,
        nome: result.rows[0].nome,
        email: result.rows[0].email,
        telefone: result.rows[0].telefone,
        matricula: result.rows[0].matricula,
        curso: result.rows[0].curso,
        role: result.rows[0].role,
        bloqueado: result.rows[0].bloqueado,
        reservas: result.rows
            .filter(row => row.reserva_id !== null)
            .map(row => ({
                id: row.reserva_id,
                quadra_id: row.quadra_id,
                data: row.data,
                hora_inicio: row.hora_inicio,
                hora_fim: row.hora_fim,
                status: row.status,
                data_criacao: row.data_criacao,
                hora_criacao: row.hora_criacao
            }))
    };

    return user;
};
