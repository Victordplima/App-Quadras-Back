import { Request, Response } from "express";
import * as quadraData from "../data/quadraData";

export const buscarTodasQuadras = async (req: Request, res: Response) => {
    try {
        const quadras = await quadraData.buscarTodasQuadras();
        res.status(200).json(quadras);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar quadras." });
    }
};

export const buscarEsportesDaQuadra = async (req: Request, res: Response) => {
    const { quadraId } = req.params;

    try {
        const esportes = await quadraData.buscarEsportesDaQuadra(quadraId);
        res.status(200).json(esportes);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar esportes da quadra." });
    }
};
