import pool from "../database/db";

export const criarReserva = async (reserva: any) => {
    const {
        usuarioId,
        quadraId,
        data,
        horaInicio,
        horaFim,
        status,
        dataCriacao,
        horaCriacao,
    } = reserva;

    const resultado = await pool.query(
        `INSERT INTO Reserva (Usuario_ID, Quadra_ID, Data, Hora_inicio, Hora_fim, Status, Data_criacao, Hora_criacao)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
            usuarioId,
            quadraId,
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



export const buscarReservasDaSemana = async (page: number = 1) => {
    const dataAtual = new Date();

    // calcula o início da semana da página especificada
    const diaAtual = dataAtual.getDate() - dataAtual.getDay(); // inicio da semana atual
    const diasAdicionais = (page - 1) * 7; // deslocamento de semanas para a página solicitada

    // define a data de início e fim da semana
    const dataInicioSemana = new Date(
        dataAtual.setDate(diaAtual + diasAdicionais)
    );
    dataInicioSemana.setHours(0, 0, 0, 0); // inicio da semana

    const dataFimSemana = new Date(dataInicioSemana);
    dataFimSemana.setDate(dataInicioSemana.getDate() + 6); // fim da semana
    dataFimSemana.setHours(23, 59, 59, 999); // final do domingo

    const dataInicioISO = dataInicioSemana.toISOString().split("T")[0];
    const dataFimISO = dataFimSemana.toISOString().split("T")[0];

    const resultado = await pool.query(
        `SELECT * FROM Reserva WHERE Data BETWEEN $1 AND $2`,
        [dataInicioISO, dataFimISO]
    );

    return resultado.rows;
};



export const buscarReservasPorUsuario = async (usuarioId: string) => {
    const resultado = await pool.query(
        `SELECT * FROM Reserva WHERE Usuario_ID = $1`,
        [usuarioId]
    );
    return resultado.rows;
};



export const alterarStatusReserva = async (
    reservaId: string,
    statusNovo: string
) => {
    await pool.query(`UPDATE Reserva SET Status = $1 WHERE ID = $2`, [
        statusNovo,
        reservaId,
    ]);
};
