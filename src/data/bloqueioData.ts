import pool from "../database/db";

export const bloquearUsuario = async (
    usuarioId: string,
    motivo: string,
    descricao: string
) => {
    const periodoInicio = new Date();
    const periodoFim = new Date();
    periodoFim.setDate(periodoInicio.getDate() + 7); // Bloqueio por 7 dias

    await pool.query(
        `INSERT INTO bloqueio (usuario_id, periodo_inicio, periodo_fim, motivo, descricao)
         VALUES ($1, $2, $3, $4, $5)`,
        [usuarioId, periodoInicio, periodoFim, motivo, descricao]
    );
};

export const obterBloqueiosAtivosPorUsuario = async (usuarioId: string) => {
    const agora = new Date();
    const resultado = await pool.query(
        `SELECT * FROM bloqueio WHERE usuario_id = $1 AND periodo_fim > $2`,
        [usuarioId, agora]
    );
    return resultado.rows;
};









export const criarBloqueioDB = async (
    usuarioId: string,
    motivo: string,
    descricao: string,
    periodoInicio: Date,
    periodoFim: Date
) => {
    const query = `
        INSERT INTO bloqueio (usuario_id, periodo_inicio, periodo_fim, motivo, descricao)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const result = await pool.query(query, [
        usuarioId,
        periodoInicio,
        periodoFim,
        motivo,
        descricao,
    ]);
    return result.rows[0];
};



export const buscarBloqueiosDB = async (limit: number, offset: number) => {
    const query = `
        SELECT 
            bloqueio.*, 
            usuario.nome AS usuario_nome, 
            usuario.id AS usuario_id, 
            usuario.curso AS usuario_curso
        FROM bloqueio
        JOIN usuario ON bloqueio.usuario_id = usuario.id
        ORDER BY bloqueio.periodo_inicio DESC
        LIMIT $1 OFFSET $2;
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
};



export const editarBloqueioDB = async (
    id: string,
    periodoInicio: Date,
    periodoFim: Date,
    motivo: string,
    descricao: string
) => {
    const query = `
        UPDATE bloqueio
        SET periodo_inicio = $1, periodo_fim = $2, motivo = $3, descricao = $4
        WHERE id = $5
        RETURNING *;
    `;
    const result = await pool.query(query, [
        periodoInicio,
        periodoFim,
        motivo,
        descricao,
        id,
    ]);
    return result.rows[0];
};



export const deletarBloqueioDB = async (id: string) => {
    const query = `
        DELETE FROM bloqueio
        WHERE id = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};



export const buscarBloqueiosPorUsuarioDB = async (usuarioId: string) => {
    const query = `
        SELECT 
            bloqueio.*, 
            usuario.nome AS usuario_nome, 
            usuario.id AS usuario_id, 
            usuario.curso AS usuario_curso
        FROM bloqueio
        JOIN usuario ON bloqueio.usuario_id = usuario.id
        WHERE bloqueio.usuario_id = $1
        ORDER BY bloqueio.periodo_inicio DESC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};