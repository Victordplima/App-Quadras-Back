import express, { Application } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import quadraRoutes from "./routes/quadraRoutes";
import "./cronJobs/rejeitarReservasPassadas";

const app: Application = express();
const server = createServer(app); // Cria um servidor HTTP com o Express
const io = new Server(server, {
    cors: {
        origin: "*", // Permite conexões de qualquer origem (ajuste se necessário)
    },
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware para disponibilizar o `io` em todas as rotas
app.use((req, res, next) => {
    req.app.set("io", io); // Adiciona o socket.io no objeto app
    next();
});

// Rotas
app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/reservas", reservaRoutes);
app.use("/quadras", quadraRoutes);

// Evento de conexão do WebSocket
io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Escuta a desconexão do cliente
    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
