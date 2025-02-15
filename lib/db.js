import mysql from "mysql2/promise";
import dotenv from "dotenv"

dotenv.config()
// Configuração do Pool de Conexões com o MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Limite de conexões no pool
    queueLimit: 0,
    port: process.env.DB_PORT,
});

export {
    pool,
}
