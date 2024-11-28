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
