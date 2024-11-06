import { Request, Response, NextFunction } from "express";
import pool from "../database/db";

export const verificarBloqueio = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { usuarioId } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM bloqueio WHERE usuario_id = $1 AND periodo_fim > CURRENT_DATE`,
            [usuarioId]
        );

        if (result.rows.length > 0) {
            const bloqueio = result.rows[0];
            res.status(403).json({
                mensagem:
                    "Você está bloqueado de fazer reservas até " +
                    bloqueio.periodo_fim,
                motivo: bloqueio.motivo,
                descricao: bloqueio.descricao,
            });
            return; // Adicionado para interromper a execução da função
        }

        next();
    } catch (error) {
        console.error("Erro ao verificar bloqueio:", error);
        res.status(500).json({ mensagem: "Erro ao verificar bloqueio." });
    }
};
