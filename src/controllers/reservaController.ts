import { Request, Response } from "express";
import * as reservaData from "../data/reservaData";

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
