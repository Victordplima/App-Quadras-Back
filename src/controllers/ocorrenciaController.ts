import { Request, Response } from "express";
import { criarOcorrencia, listarOcorrencias } from "../data/ocorrenciaData";

export const criarOcorrenciaController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { reserva_id, utilizacao, relato } = req.body as {
        reserva_id: string; // UUID
        utilizacao: string;
        relato?: string;
    };

    if (!reserva_id || !utilizacao) {
        res.status(400).json({
            mensagem: "Reserva e utilização são obrigatórias.",
        });
        return;
    }

    try {
        const novaOcorrencia = await criarOcorrencia({
            reserva_id,
            utilizacao,
            relato,
        });
        res.status(201).json(novaOcorrencia);
    } catch (error) {
        console.error("Erro ao criar ocorrência:", error);
        res.status(500).json({ mensagem: "Erro ao criar a ocorrência." });
    }
};

export const listarOcorrenciasController = async (
    req: Request,
    res: Response
) => {
    const {
        usuario_id,
        page = "1",
        limit = "20",
    } = req.query as {
        usuario_id?: string;
        page?: string;
        limit?: string;
    };

    const pagina = parseInt(page, 10);
    const limite = parseInt(limit, 10);

    try {
        const ocorrencias = await listarOcorrencias({
            usuario_id,
            page: pagina,
            limit: limite,
        });

        res.status(200).json(ocorrencias);
    } catch (error) {
        console.error("Erro ao listar ocorrências:", error);
        res.status(500).json({ mensagem: "Erro ao buscar ocorrências." });
    }
};
