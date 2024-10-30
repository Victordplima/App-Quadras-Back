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



export const buscarReservasDaSemana = async (page: number = 1, quadraId?: string) => {
    const dataAtual = new Date();

    // Calcula o início da semana da página especificada
    const diaAtual = dataAtual.getDate() - dataAtual.getDay(); // início da semana atual
    const diasAdicionais = (page - 1) * 7; // deslocamento de semanas para a página solicitada

    // Define a data de início e fim da semana
    const dataInicioSemana = new Date(dataAtual.setDate(diaAtual + diasAdicionais));
    dataInicioSemana.setHours(0, 0, 0, 0); // início da semana

    const dataFimSemana = new Date(dataInicioSemana);
    dataFimSemana.setDate(dataInicioSemana.getDate() + 6); // fim da semana
    dataFimSemana.setHours(23, 59, 59, 999); // final do domingo

    const dataInicioISO = dataInicioSemana.toISOString().split("T")[0];
    const dataFimISO = dataFimSemana.toISOString().split("T")[0];

    // se um quadraId for fornecido, incluir na query
    let query = `SELECT * FROM Reserva WHERE Data BETWEEN $1 AND $2`;
    const params: any[] = [dataInicioISO, dataFimISO];

    if (quadraId) {
        query += ` AND Quadra_ID = $3`;
        params.push(quadraId);
    }

    const resultado = await pool.query(query, params);
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
