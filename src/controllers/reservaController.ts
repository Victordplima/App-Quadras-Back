import { Request, Response } from "express";
import * as reservaData from "../data/reservaData";
import pool from "../database/db";
import { bloquearUsuario } from "../controllers/bloqueioController";

export const criarReserva = async (req: Request, res: Response) => {
    const { usuarioId, quadraId, data, horaInicio, horaFim } = req.body;

    try {
        const novaReserva = {
            usuarioId,
            quadraId,
            data,
            horaInicio,
            horaFim,
            status: "Aguardando confirmação",
            dataCriacao: new Date(),
            horaCriacao: new Date().toLocaleTimeString(),
        };

        const reservaCriada = await reservaData.criarReserva(novaReserva);
        res.status(201).json(reservaCriada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar a reserva." });
    }
};




export const buscarReservasDaSemana = async (req: Request, res: Response) => {
    const { page = 1, quadraId } = req.query;

    try {
        const reservas = await reservaData.buscarReservasDaSemana(Number(page), quadraId as string);
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar reservas da semana." });
    }
};



export const buscarReservasPorUsuario = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;

    try {
        const reservas = await reservaData.buscarReservasPorUsuario(usuarioId);
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar reservas do usuário." });
    }
};



export const alterarStatusReserva = async (req: Request, res: Response) => {
    const { reservaId } = req.params;
    const { status } = req.body;

    try {
        await reservaData.alterarStatusReserva(reservaId, status);
        res.status(200).json({ message: "Status atualizado com sucesso." });
    } catch (error) {
        res.status(500).json({
            error: "Erro ao atualizar o status da reserva.",
        });
    }
};



export const marcarAusenciaEbloquear = async (reservaId: number, usuarioId: number) => {
    const motivo = "Ausência em reserva";
    const descricao = "O usuário não compareceu à reserva e foi bloqueado por uma semana.";

    await pool.query(`UPDATE reserva SET status = 'Não compareceu' WHERE id = $1`, [reservaId]);

    await bloquearUsuario(usuarioId, motivo, descricao);
};



export const buscarAgendamentosPorQuadraEDia = async (req: Request, res: Response) => {
    const { quadraId } = req.params;
    const { data } = req.query;

    try {
        const agendamentos = await reservaData.buscarAgendamentosPorQuadraEDia(quadraId, data as string);
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar agendamentos." });
    }
};
