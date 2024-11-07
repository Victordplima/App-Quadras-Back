import { Request, Response } from "express";
import * as quadraData from "../data/quadraData";

export const buscarTodasQuadras = async (req: Request, res: Response) => {
    try {
        const quadrasComEsportes = await quadraData.buscarTodasQuadras();

        const quadras = quadrasComEsportes.reduce((acc: any, row: any) => {
            const { quadra_id, quadra_nome, esporte_id, esporte_nome } = row;

            if (!acc[quadra_id]) {
                acc[quadra_id] = {
                    id: quadra_id,
                    nome: quadra_nome,
                    esportes: []
                };
            }

            if (esporte_id) {
                acc[quadra_id].esportes.push({ id: esporte_id, nome: esporte_nome });
            }

            return acc;
        }, {});

        res.status(200).json(Object.values(quadras));
    } catch (error) {
        console.error("Erro ao buscar quadras com esportes:", error);
        res.status(500).json({ error: "Erro ao buscar quadras com esportes." });
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
