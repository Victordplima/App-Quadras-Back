import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes'
import reservaRoutes from './routes/reservaRoutes'
import quadraRoutes from './routes/quadraRoutes'

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/usuarios', userRoutes);
app.use('/reservas', reservaRoutes);
app.use('/quadras', quadraRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;