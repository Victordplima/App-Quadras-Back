import { RequestHandler } from "express";
import pool from "../database/db";

export const verificarHorarioPermitido: RequestHandler = (req, res, next) => {
    const { horaInicio, horaFim } = req.body;
    const inicio = parseInt(horaInicio.split(":")[0], 10);
    const fim = parseInt(horaFim.split(":")[0], 10);

    if (inicio < 13 || fim > 21) {
        res.status(400).json({
            mensagem: "A reserva deve ser entre 13:00 e 21:00.",
        });
        return;
    }
    next();
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
            AND (Hora_inicio = $3::time - interval '1 hour' OR Hora_inicio = $3::time + interval '1 hour')
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
