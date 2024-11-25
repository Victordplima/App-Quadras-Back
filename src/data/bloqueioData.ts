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
