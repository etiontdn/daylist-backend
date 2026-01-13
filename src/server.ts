import express from 'express';
import routes from './routes'; // Importa o index.ts das rotas

const app = express();

app.use(express.json()); // Para o Express entender JSON no corpo das requisições
app.use(routes); // Ativa todas as rotas que criamos

app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});