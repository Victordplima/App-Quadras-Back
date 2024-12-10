import { Request, Response } from "express";
import * as reservaData from "../data/reservaData";
import * as bloqueioData from "../data/bloqueioData";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "quadrasmaneiras123";

export const criarReserva = async (req: Request, res: Response) => {
    const { usuarioId, quadraId, esporteId, data, horaInicio, horaFim } =
        req.body;

    try {
        const novaReserva = {
            usuarioId,
            quadraId,
            esporteId,
            data,
            horaInicio,
            horaFim,
            status: "Aguardando confirmação",
            dataCriacao: new Date(),
            horaCriacao: new Date().toLocaleTimeString(),
        };

        const reservaCriada = await reservaData.criarReserva(novaReserva);

        // Emite o evento para todos os clientes conectados
        const io = req.app.get("io");
        io.emit("atualizarReservas", {
            mensagem: "Uma nova reserva foi criada!",
            reserva: reservaCriada,
        });

        res.status(201).json(reservaCriada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar a reserva." });
    }
};



export const criarReservaAdmin = async (req: Request, res: Response) => {
    const { usuarioId, quadraId, esporteId, data, horaInicio, horaFim } =
        req.body;

    try {
        const novaReserva = {
            usuarioId,
            quadraId,
            esporteId,
            data,
            horaInicio,
            horaFim,
            status: "Aula",
            dataCriacao: new Date(),
            horaCriacao: new Date().toLocaleTimeString(),
        };

        const reservaCriada = await reservaData.criarReservaAdmin(novaReserva);

        // Emite o evento para todos os clientes conectados
        const io = req.app.get("io");
        io.emit("atualizarReservas", {
            mensagem: "Uma nova reserva foi criada!",
            reserva: reservaCriada,
        });

        res.status(201).json(reservaCriada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar a reserva." });
    }
};



export const buscarReservasDaSemana = async (req: Request, res: Response) => {
    const { page = 1, quadraId } = req.query;

    try {
        // Chama a função de busca de reservas, passando os parâmetros corretamente
        const reservas = await reservaData.buscarReservasDaSemana(
            Number(page),
            quadraId as string // Passando o quadraId como string
        );
        res.status(200).json(reservas); // Retorna as reservas encontradas
    } catch (error) {
        // Se houver um erro, retorna status 500 e uma mensagem de erro
        res.status(500).json({ error: "Erro ao buscar reservas da semana." });
    }
};


export const buscarReservasPorUsuario = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    const { page, limit, quadra } = req.query;

    try {
        const reservas = await reservaData.buscarReservasPorUsuario(
            usuarioId,
            parseInt(page as string) || 1,
            parseInt(limit as string) || 10,
            quadra as string
        );
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

        // Obtém a instância do `io` para emitir eventos
        const io = req.app.get("io");

        // Emite o evento de atualização de status para os clientes conectados
        io.emit("atualizarReservas", {
            mensagem: `O status da reserva ${reservaId} foi atualizado para ${status}.`,
            reservaId,
            status,
        });

        res.status(200).json({ message: "Status atualizado com sucesso." });
    } catch (error) {
        console.error("Erro ao atualizar o status da reserva:", error);
        res.status(500).json({
            error: "Erro ao atualizar o status da reserva.",
        });
    }
};

export const buscarAgendamentosPorQuadraEDia = async (
    req: Request,
    res: Response
) => {
    const { quadraId } = req.params;
    const { data } = req.query;

    try {
        const agendamentos = await reservaData.buscarAgendamentosPorQuadraEDia(
            quadraId,
            data as string
        );
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar agendamentos." });
    }
};

export const cancelarReserva = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { reservaId } = req.params;
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ error: "Usuário não autenticado." });
        return;
    }

    try {
        // Decodificando o token diretamente
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const userId = decoded.userId;

        if (!userId) {
            res.status(401).json({ error: "Usuário não autenticado." });
            return;
        }

        // Obtém a reserva para verificar informações
        const reserva = await reservaData.obterReservaPorId(reservaId);

        if (!reserva) {
            res.status(404).json({ error: "Reserva não encontrada." });
            return;
        }

        const dataReserva = new Date(reserva.data);
        const hoje = new Date();
        const diasDeAntecedencia = Math.ceil(
            (dataReserva.getTime() - hoje.getTime()) / (1000 * 3600 * 24)
        );

        // Bloqueia o usuário se a reserva for cancelada com menos de 5 dias de antecedência
        if (diasDeAntecedencia <= 5) {
            await bloqueioData.bloquearUsuario(
                userId,
                "Cancelamento tardio",
                "Cancelou a reserva com menos de 5 dias de antecedência."
            );
        }

        // Atualiza o status da reserva para "Cancelada"
        await reservaData.atualizarStatusReserva(reservaId, "Cancelada");

        // Obtém a instância do Socket.IO
        const io = req.app.get("io");

        // Emite o evento de atualização para todos os clientes conectados
        io.emit("atualizarReservas", {
            mensagem: `A reserva ${reservaId} foi cancelada.`,
            reservaId,
            status: "Cancelada",
        });

        res.json({ message: "Reserva cancelada com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cancelar a reserva." });
    }
};

export const buscarReservasDoDia = async (req: Request, res: Response) => {
    try {
        const reservas = await reservaData.buscarReservasPorData(new Date());
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Erro ao buscar reservas do dia:", error);
        res.status(500).json({ mensagem: "Erro ao buscar reservas do dia." });
    }
};

export const buscarReservasDoDiaSemOcorrencias = async (
    req: Request,
    res: Response
) => {
    try {
        const reservas = await reservaData.buscarReservasDoDiaSemOcorrenciasData(new Date());
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Erro ao buscar reservas sem ocorrências:", error);
        res.status(500).json({ error: "Erro ao buscar reservas do dia atual sem ocorrências." });
    }
};