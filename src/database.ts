import mysql from "mysql2/promise";
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

async function initializeDatabase() {
    try {
        console.log("Checando/Criando tabelas no banco de dados...");

        // 1. Tabela Usuario
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                senha_hash VARCHAR(255) NOT NULL,
                tipo_usuario ENUM('CLIENTE', 'ADMIN') NOT NULL
            )
        `);

        // 2. Tabela Perfil (Depende de Usuario)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Perfis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT UNIQUE,
                dataNascimento DATE,
                sexo ENUM('M', 'F'),
                alturaCm INT,
                pesoKg FLOAT,
                ofensivaAtual INT DEFAULT 0,
                maiorOfensiva INT DEFAULT 0,
                ultimaOfensivaAtualizacao DATE,
                FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
            )
        `);

        // 3. Tabela Habito (Depende de Perfil)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Habitos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                perfil_id INT,
                nome VARCHAR(100) NOT NULL,
                categoria VARCHAR(100),
                frequencia ENUM('DIARIO', 'SEMANAL'),
                unidadeMedida VARCHAR(50),
                metaAlvo FLOAT,
                ativo BOOLEAN DEFAULT TRUE,
                motivacao TEXT,
                FOREIGN KEY (perfil_id) REFERENCES Perfis(id) ON DELETE CASCADE
            )
        `);

        // 4. Tabela RegistroHabito (Depende de Habito)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS RegistrosHabito (
                id INT AUTO_INCREMENT PRIMARY KEY,
                habito_id INT,
                dataReferencia DATE,
                qtdRealizada FLOAT DEFAULT 0,
                status ENUM('PENDENTE', 'PARCIAL', 'CONCLUIDO'),
                atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (habito_id) REFERENCES Habitos(id) ON DELETE CASCADE
                UNIQUE KEY unique_registro_periodo (habito_id, dataReferencia)
            )
        `);

        // 5. Tabela RelatorioIA (Depende de Perfil)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS RelatoriosIA (
                id INT AUTO_INCREMENT PRIMARY KEY,
                perfil_id INT,
                textoAnalise TEXT,
                dataInicio DATE,
                dataFim DATE,
                dataGeracao DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (perfil_id) REFERENCES Perfis(id) ON DELETE CASCADE
            )
        `);

        console.log("Banco de dados inicializado com sucesso.");
    } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error);
    }
}

// Executa a inicialização
initializeDatabase();

export default pool;
