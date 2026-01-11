import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    queueLimit: 0,
});

/* TODO: Adicionar Checagem de existência de Tabelas e
Criar as tabelas básicas se não existirem */

export default pool;
