import pool from "../database/db";

export const criarReserva = async (reserva: any) => {
    const {
        usuarioId,
        quadraId,
        esporteId,
        data,
        horaInicio,
        horaFim,
        status,
        dataCriacao,
        horaCriacao,
    } = reserva;

    const resultado = await pool.query(
        `INSERT INTO reserva (usuario_id, quadra_id, esporte_id, data, hora_inicio, hora_fim, status, data_criacao, hora_criacao)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
            usuarioId,
            quadraId,
            esporteId,
            data,
            horaInicio,
            horaFim,
            status,
            dataCriacao,
            horaCriacao,
        ]
    );

    return resultado.rows[0];
};


export const buscarReservasDaSemana = async (page: number = 1, quadraId?: string) => {
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDate() - dataAtual.getDay();
    const diasAdicionais = (page - 1) * 7;

    const dataInicioSemana = new Date(dataAtual.setDate(diaAtual + diasAdicionais));
    dataInicioSemana.setHours(0, 0, 0, 0);

    const dataFimSemana = new Date(dataInicioSemana);
    dataFimSemana.setDate(dataInicioSemana.getDate() + 6);
    dataFimSemana.setHours(23, 59, 59, 999);

    const dataInicioISO = dataInicioSemana.toISOString().split("T")[0];
    const dataFimISO = dataFimSemana.toISOString().split("T")[0];

    let query = `
        SELECT r.*, e.nome AS esporte_nome
        FROM reserva r
        JOIN esporte e ON r.esporte_id = e.id
        WHERE r.data BETWEEN $1 AND $2
    `;
    const params: any[] = [dataInicioISO, dataFimISO];

    if (quadraId) {
        query += ` AND r.quadra_id = $3`;
        params.push(quadraId);
    }

    const resultado = await pool.query(query, params);
    return resultado.rows;
};


export const buscarReservasPorUsuario = async (usuarioId: string) => {
    const resultado = await pool.query(
        `SELECT r.*, e.nome AS esporte_nome
         FROM reserva r
         JOIN esporte e ON r.esporte_id = e.id
         WHERE r.usuario_id = $1`,
        [usuarioId]
    );
    return resultado.rows;
};


export const alterarStatusReserva = async (
    reservaId: string,
    status: string
) => {
    await pool.query(`UPDATE Reserva SET Status = $1 WHERE ID = $2`, [
        status,
        reservaId,
    ]);
};



export const buscarAgendamentosPorQuadraEDia = async (quadraId: string, data: string) => {
    const resultado = await pool.query(
        `SELECT * FROM reserva WHERE quadra_id = $1 AND data = $2`,
        [quadraId, data]
    );
    return resultado.rows;
};