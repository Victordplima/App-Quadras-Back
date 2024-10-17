import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,       // Usuario
    host: process.env.DB_HOST,       // Host
    database: process.env.DB_NAME,   // Nome do banco
    password: process.env.DB_PASSWORD, // Senha
    port: parseInt(process.env.DB_PORT || '5432', 10), // Porta
});

export default pool;
