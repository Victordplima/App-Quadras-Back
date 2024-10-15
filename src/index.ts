import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
