import pool from "../database/db";

export const criarOcorrencia = async ({
    reserva_id,
    utilizacao,
    relato,
}: {
    reserva_id: string; // UUID
    utilizacao: string;
    relato?: string;
}) => {
    const query = `
        INSERT INTO ocorrencias (reserva_id, utilizacao, relato)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const valores = [reserva_id, utilizacao, relato];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
};

export const listarOcorrencias = async ({
    usuario_id,
    page,
    limit,
}: {
    usuario_id?: string;
    page: number;
    limit: number;
}) => {
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM ocorrencias`;
    const valores: any[] = [];

    if (usuario_id) {
        query += ` WHERE reserva_id IN (
            SELECT id FROM reserva WHERE usuario_id = $1
        )`;
        valores.push(usuario_id);
    }

    query += ` ORDER BY id DESC LIMIT $${valores.length + 1} OFFSET $${
        valores.length + 2
    }`;
    valores.push(limit.toString(), offset.toString());

    try {
        const resultado = await pool.query(query, valores);
        return resultado.rows;
    } catch (error) {
        console.error("Erro ao executar consulta:", error);
        throw error;
    }
};



export const editarOcorrenciaDB = async (id: string, utilizacao: string, relato: string) => {
    const query = `
        UPDATE ocorrencias
        SET utilizacao = $1, relato = $2
        WHERE id = $3
        RETURNING *;
    `;
    
    const result = await pool.query(query, [utilizacao, relato, id]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};



export const deletarOcorrenciaDB = async (id: string) => {
    const query = `
        DELETE FROM ocorrencias
        WHERE id = $1
        RETURNING *;
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};