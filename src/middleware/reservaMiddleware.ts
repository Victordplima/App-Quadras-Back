import { RequestHandler } from "express";
import pool from "../database/db";

// Middleware para verificar horários permitidos
export const verificarHorarioPermitido: RequestHandler = (req, res, next) => {
    const { horaInicio, horaFim, data } = req.body;

    try {
        // Validação do horário
        const inicio = parseInt(horaInicio.split(":")[0], 10);
        const fim = parseInt(horaFim.split(":")[0], 10);

        if (inicio < 13 || fim > 21) {
            res.status(400).json({
                mensagem: "A reserva deve ser entre 13:00 e 21:00.",
            });
            return; // Encerra a função aqui
        }

        // Validação se a data e hora já passaram
        const dataAtual = new Date();
        const dataReserva = new Date(`${data}T${horaInicio}`);

        if (dataReserva < dataAtual) {
            res.status(400).json({
                mensagem:
                    "Não é possível criar uma reserva para uma data ou horário que já passou.",
            });
            return; // Encerra a função aqui
        }

        next(); // Continua o fluxo se estiver tudo válido
    } catch (error) {
        console.error("Erro ao validar horário da reserva:", error);
        res.status(500).json({
            mensagem: "Erro ao validar o horário ou data da reserva.",
        });
    }
};

// Middleware para verificar reservas consecutivas
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
            return; // Encerra a função aqui
        }

        next(); // Continua o fluxo se não houver reservas consecutivas
    } catch (error) {
        console.error("Erro ao verificar reserva consecutiva:", error);
        res.status(500).json({
            mensagem: "Erro ao verificar reserva consecutiva.",
        });
    }
};
