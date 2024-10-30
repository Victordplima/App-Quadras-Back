import pool from "../database/db";

export const buscarTodasQuadras = async () => {
    const resultado = await pool.query(`SELECT * FROM Quadra`);
    return resultado.rows;
};

export const buscarEsportesDaQuadra = async (quadraId: string) => {
    const resultado = await pool.query(
        `SELECT Esporte FROM Quadra_Esportes WHERE Quadra_ID = $1`,
        [quadraId]
    );
    return resultado.rows;
};
