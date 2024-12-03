import { Request, Response } from "express";
import {
    criarBloqueioDB,
    buscarBloqueiosDB,
    editarBloqueioDB,
    deletarBloqueioDB,
    buscarBloqueiosPorUsuarioDB
} from "../data/bloqueioData";

// Criar bloqueio
export const criarBloqueio = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { usuarioId, motivo, descricao } = req.body;
        const periodoInicio = new Date();
        const periodoFim = new Date();
        periodoFim.setDate(periodoInicio.getDate() + 7); // Bloqueio por 7 dias

        const novoBloqueio = await criarBloqueioDB(
            usuarioId,
            motivo,
            descricao,
            periodoInicio,
            periodoFim
        );

        res.status(201).json({
            mensagem: "Bloqueio criado com sucesso",
            bloqueio: novoBloqueio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao criar bloqueio" });
    }
};

// Buscar bloqueios com paginação
export const buscarBloqueios = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const bloqueios = await buscarBloqueiosDB(Number(limit), offset);
        res.status(200).json(bloqueios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao buscar bloqueios" });
    }
};

// Editar bloqueio
export const editarBloqueio = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { periodoInicio, periodoFim, motivo, descricao } = req.body;

        if (!periodoInicio || !periodoFim || !motivo) {
            res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios",
            });
            return;
        }

        const bloqueioAtualizado = await editarBloqueioDB(
            id,
            new Date(periodoInicio),
            new Date(periodoFim),
            motivo,
            descricao
        );

        if (!bloqueioAtualizado) {
            res.status(404).json({ mensagem: "Bloqueio não encontrado" });
            return;
        }

        res.status(200).json({
            mensagem: "Bloqueio atualizado com sucesso",
            bloqueio: bloqueioAtualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao atualizar bloqueio" });
    }
};

// Deletar bloqueio
export const deletarBloqueio = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const bloqueioDeletado = await deletarBloqueioDB(id);

        if (!bloqueioDeletado) {
            res.status(404).json({ mensagem: "Bloqueio não encontrado" });
            return;
        }

        res.status(200).json({ mensagem: "Bloqueio deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao deletar bloqueio" });
    }
};


export const buscarBloqueiosPorUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarioId } = req.params;

        const bloqueios = await buscarBloqueiosPorUsuarioDB(usuarioId);

        if (bloqueios.length === 0) {
            res.status(404).json({ mensagem: "Nenhum bloqueio encontrado para este usuário" });
            return;
        }

        res.status(200).json(bloqueios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao buscar bloqueios do usuário" });
    }
};