import express from 'express';
import routes from './routes';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json()); // Para o Express entender JSON no corpo das requisições
app.use(routes); // Ativa todas as rotas que criamos

app.listen(5050, () => {
  console.log("🚀 Servidor rodando na porta 5050");
});