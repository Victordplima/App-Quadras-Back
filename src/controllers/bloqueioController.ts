import { Request, Response } from "express";
import pool from "../database/db";

export const bloquearUsuario = async (usuarioId: number, motivo: string, descricao: string) => {
    const periodoInicio = new Date();
    const periodoFim = new Date();
    periodoFim.setDate(periodoInicio.getDate() + 7);

    await pool.query(
        `INSERT INTO bloqueio (usuario_id, periodo_inicio, periodo_fim, motivo, descricao)
         VALUES ($1, $2, $3, $4, $5)`,
        [usuarioId, periodoInicio, periodoFim, motivo, descricao]
    );
};
