import cron from "node-cron";
import pool from "../database/db";

cron.schedule(
    "1 * * * *",
    async () => {
        console.log("Cron job iniciado: Rejeitando reservas pendentes cujo horário já passou...");

        try {
            const query = `
                UPDATE Reserva
                SET status = 'rejeitada'
                WHERE status = 'pendente' 
                AND (Data < CURRENT_DATE OR (Data = CURRENT_DATE AND Hora_inicio < CURRENT_TIME))
            `;

            const result = await pool.query(query);
            console.log(`Cron job finalizado. Reservas rejeitadas: ${result.rowCount}`);
        } catch (error) {
            console.error("Erro ao executar o cron job:", error);
        }
    },
    {
        timezone: "America/Sao_Paulo",
    }
);
