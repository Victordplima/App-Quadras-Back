import { RequestHandler } from "express";
import pool from "../database/db";

export const verificarHorarioPermitido: RequestHandler = async (req, res, next) => {
    const { horaInicio, horaFim, data, quadraId } = req.body;

    try {
        const inicio = parseInt(horaInicio.split(":")[0], 10);
        const fim = parseInt(horaFim.split(":")[0], 10);

        if (inicio < 13 || fim > 21) {
            res.status(400).json({
                mensagem: "A reserva deve ser entre 13:00 e 21:00.",
            });
            return;
        }

        const dataAtual = new Date();
        const dataReservaInicio = new Date(`${data}T${horaInicio}`);
        const dataReservaFim = new Date(`${data}T${horaFim}`);

        if (dataReservaInicio < dataAtual) {
            res.status(400).json({
                mensagem: "Não é possível criar uma reserva para uma data ou horário que já passou.",
            });
            return;
        }

        const query = `
            SELECT 1 
            FROM reserva 
            WHERE quadra_id = $1
            AND data = $2
            AND (
                (hora_inicio < $4 AND hora_fim > $3) OR
                (hora_inicio >= $3 AND hora_inicio < $4)
            )
        `;
        const params = [quadraId, data, horaInicio, horaFim];

        const resultado = await pool.query(query, params);

        if (resultado?.rowCount && resultado.rowCount > 0) {
            res.status(400).json({
                mensagem: "Já existe uma reserva para esta quadra no horário especificado.",
            });
            return;
        }

        next();
    } catch (error) {
        console.error("Erro ao validar horário da reserva:", error);
        res.status(500).json({
            mensagem: "Erro ao validar o horário ou data da reserva.",
        });
    }
};



export const verificarReservaConsecutiva: RequestHandler = async (
    req,
    res,
    next
) => {
    const { usuarioId, data, horaInicio } = req.body;

    try {
        const query = `
            SELECT * FROM Reserva
            WHERE Usuario_ID = $1 
            AND Data = $2 
            AND (
                Hora_inicio = $3::time - interval '1 hour' 
                OR Hora_inicio = $3::time + interval '1 hour'
            )
        `;
        const result = await pool.query(query, [usuarioId, data, horaInicio]);

        if (result.rows.length > 0) {
            res.status(400).json({
                mensagem: "Não é permitido fazer duas reservas seguidas.",
            });
            return;
        }

        next();
    } catch (error) {
        console.error("Erro ao verificar reserva consecutiva:", error);
        res.status(500).json({
            mensagem: "Erro ao verificar reserva consecutiva.",
        });
    }
};
