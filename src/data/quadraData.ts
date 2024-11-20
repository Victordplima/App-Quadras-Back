import pool from "../database/db";

export const buscarTodasQuadras = async () => {
    const resultado = await pool.query(`
        SELECT 
            q.id AS quadra_id,
            q.nome AS quadra_nome,
            e.id AS esporte_id,
            e.nome AS esporte_nome
        FROM 
            quadra q
        LEFT JOIN 
            quadra_esporte qe ON q.id = qe.quadra_id
        LEFT JOIN 
            esporte e ON qe.esporte_id = e.id
        ORDER BY 
            q.id;
    `);

    return resultado.rows;
};



export const buscarEsportesDaQuadra = async (quadraId: string) => {
    const resultado = await pool.query(
        `
        SELECT 
            e.id AS esporte_id, 
            e.nome AS esporte_nome
        FROM 
            quadra_esporte qe
        INNER JOIN 
            esporte e ON qe.esporte_id = e.id
        WHERE 
            qe.quadra_id = $1
        `,
        [quadraId]
    );
    return resultado.rows;
};