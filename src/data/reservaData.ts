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

export const buscarReservasDaSemana = async (
    page: number = 1,
    quadraId?: string
) => {
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDate() - dataAtual.getDay();
    const diasAdicionais = (page - 1) * 7;

    const dataInicioSemana = new Date(
        dataAtual.setDate(diaAtual + diasAdicionais)
    );
    dataInicioSemana.setHours(0, 0, 0, 0);

    const dataFimSemana = new Date(dataInicioSemana);
    dataFimSemana.setDate(dataInicioSemana.getDate() + 6);
    dataFimSemana.setHours(23, 59, 59, 999);

    const dataInicioISO = dataInicioSemana.toISOString().split("T")[0];
    const dataFimISO = dataFimSemana.toISOString().split("T")[0];

    let query = `
        SELECT r.*, e.nome AS esporte_nome, u.nome AS usuario_nome, u.curso, u.matricula
        FROM reserva r
        JOIN esporte e ON r.esporte_id = e.id
        JOIN usuario u ON r.usuario_id = u.id
        WHERE r.data BETWEEN $1 AND $2
    `;
    const params: any[] = [dataInicioISO, dataFimISO];

    if (quadraId) {
        query += ` AND r.quadra_id = $3`;
        params.push(quadraId);
    }

    console.log("Query:", query); // Verifique a query gerada
    console.log("Params:", params); // Verifique os parâmetros enviados

    const resultado = await pool.query(query, params);
    return resultado.rows;
};

export const buscarReservasPorUsuario = async (
    usuarioId: string,
    page: number = 1,
    limit: number = 10,
    nomeQuadra?: string
) => {
    const offset = (page - 1) * limit;

    let query = `
        SELECT r.*, q.nome AS quadra_nome, e.nome AS esporte_nome
        FROM reserva r
        JOIN esporte e ON r.esporte_id = e.id
        JOIN quadra q ON r.quadra_id = q.id
        WHERE r.usuario_id = $1
    `;
    const params: any[] = [usuarioId, limit, offset];

    if (nomeQuadra) {
        //busca pelo nome da quadra (sem case sensitive)
        query += ` AND q.nome ILIKE $4`;
        params.push(`%${nomeQuadra}%`);
    }

    query += ` LIMIT $2 OFFSET $3`;

    const result = await pool.query(query, params);
    return result.rows;
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

export const buscarAgendamentosPorQuadraEDia = async (
    quadraId: string,
    data: string
) => {
    const resultado = await pool.query(
        `SELECT * FROM reserva WHERE quadra_id = $1 AND data = $2`,
        [quadraId, data]
    );
    return resultado.rows;
};

export const obterReservaPorId = async (reservaId: string) => {
    const resultado = await pool.query(`SELECT * FROM reserva WHERE id = $1`, [
        reservaId,
    ]);
    return resultado.rows[0];
};

export const atualizarStatusReserva = async (
    reservaId: string,
    status: string
): Promise<void> => {
    await pool.query(`UPDATE reserva SET status = $1 WHERE id = $2`, [
        status,
        reservaId,
    ]);
};

export const buscarReservasPorData = async (data: Date) => {
    const query = `
        SELECT 
            r.id AS reserva_id,
            r.usuario_id,
            r.quadra_id,
            r.esporte_id,
            r.data,
            r.hora_inicio,
            r.hora_fim,
            r.status,
            u.nome AS usuario_nome, -- Nome da pessoa que agendou
            q.nome AS quadra_nome,
            e.nome AS esporte_nome
        FROM reserva r
        JOIN usuario u ON r.usuario_id = u.id -- Relaciona a reserva com o usuário
        JOIN quadra q ON r.quadra_id = q.id
        JOIN esporte e ON r.esporte_id = e.id
        WHERE r.data = $1
        ORDER BY r.hora_inicio ASC
    `;
    const result = await pool.query(query, [data.toISOString().split("T")[0]]);
    return result.rows;
};

export const buscarReservasDoDiaSemOcorrenciasData = async (data: Date) => {
    const dataFormatada = data.toISOString().split("T")[0]; // Formata para 'YYYY-MM-DD'
    console.log("Data formatada:", dataFormatada);

    const query = `
        SELECT 
            r.*, 
            u.nome AS usuario_nome, 
            e.nome AS esporte_nome,
            q.nome AS quadra_nome
        FROM reserva r
        INNER JOIN usuario u ON r.usuario_id = u.id
        INNER JOIN esporte e ON r.esporte_id = e.id
        INNER JOIN quadra q ON r.quadra_id = q.id
        WHERE 
            DATE(r.data) = DATE($1) -- Data do dia especificado
            AND r.status = 'Confirmada' -- Apenas reservas confirmadas
            AND NOT EXISTS ( -- Excluir reservas que possuem ocorrências
                SELECT 1 
                FROM ocorrencias o
                WHERE o.reserva_id = r.id
            )
        ORDER BY r.hora_inicio;
    `;
    const valores = [dataFormatada];
    const resultado = await pool.query(query, valores);
    return resultado.rows;
};

