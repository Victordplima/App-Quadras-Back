import request from "supertest";
import app from "../index";
import pool from "../database/db";

// Mock do pool.query
jest.mock("../database/db", () => ({
    query: jest.fn(),
}));

describe("Reserva Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /reservas", () => {
        it("Deve criar uma nova reserva", async () => {
            const novaReserva = {
                usuarioId: "123",
                quadraId: "1",
                data: "2024-10-23",
                horaInicio: "14:00",
                horaFim: "15:00",
            };

            // Mockando o comportamento do banco de dados
            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{ ...novaReserva, status: "Aguardando confirmação" }],
            });

            const resposta = await request(app)
                .post("/reservas")
                .send(novaReserva);

            expect(resposta.status).toBe(201);
            expect(resposta.body).toMatchObject({
                usuarioId: "123",
                quadraId: "1",
                data: "2024-10-23",
                horaInicio: "14:00",
                horaFim: "15:00",
                status: "Aguardando confirmação",
            });
        });
    });

    describe("GET /reservas/semana", () => {
        it("Deve buscar reservas da semana para admin ou supervisao", async () => {
            const token = "Bearer validToken123";

            const reservasMock = [
                {
                    id: "1",
                    data: "2024-10-23",
                    horaInicio: "14:00",
                    horaFim: "15:00",
                    usuarioId: "123",
                },
                {
                    id: "2",
                    data: "2024-10-24",
                    horaInicio: "16:00",
                    horaFim: "17:00",
                    usuarioId: "124",
                },
            ];

            (pool.query as jest.Mock).mockResolvedValue({ rows: reservasMock });

            const resposta = await request(app)
                .get("/reservas/semana")
                .set("Authorization", token);

            expect(resposta.status).toBe(200);
            expect(resposta.body).toEqual(reservasMock);
        });

        it("Deve retornar 403 se o usuário não for admin ou supervisao", async () => {
            const token = "Bearer invalidToken123";

            const resposta = await request(app)
                .get("/reservas/semana")
                .set("Authorization", token);

            expect(resposta.status).toBe(403);
            expect(resposta.body).toEqual({
                mensagem:
                    "Acesso negado. Apenas administradores ou supervisores podem realizar esta ação.",
            });
        });
    });

    describe("PUT /reservas/status/:reservaId", () => {
        it("Deve alterar o status de uma reserva", async () => {
            const token = "Bearer validToken123";
            const reservaId = "123";
            const statusNovo = "Confirmada";

            (pool.query as jest.Mock).mockResolvedValue({});

            const resposta = await request(app)
                .put(`/reservas/status/${reservaId}`)
                .set("Authorization", token)
                .send({ statusNovo });

            expect(resposta.status).toBe(200);
            expect(resposta.body).toEqual({
                message: "Status atualizado com sucesso.",
            });
        });
    });
});
