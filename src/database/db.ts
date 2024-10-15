import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quadras_db',
  waitForConnections: true,
  connectionLimit: 10,  // Número máximo de conexões simultâneas
  queueLimit: 0,  // Sem limite de fila
});

export const db = pool.promise();
