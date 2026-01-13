# 🌿 Daylist API

**Sistema de Gestão de Hábitos e Gamificação de Saúde**

Este projeto é uma API REST desenvolvida para auxiliar usuários a monitorar hábitos diários e semanais, promovendo uma vida mais saudável através de mecânicas de persistência (Ofensivas/Streaks).

### 🚀 Tecnologias Utilizadas

* **Runtime:** Node.js com TypeScript
* **Framework:** Express
* **Banco de Dados:** MySQL
* **Segurança:** Bcrypt para hashing de senhas

---

## 📑 Documentação da API

### 1. Autenticação e Usuários

| Rota | Método | Descrição | Body (JSON) | Resposta (201/200) |
| --- | --- | --- | --- | --- |
| `/auth/registrar` | `POST` | Cria conta e gera hábitos iniciais. | `{ "email", "senha" }` | `{ "message", "data": { "usuarioId" } }` |
| `/auth/login` | `POST` | Autentica e retorna tipo de usuário. | `{ "email", "senha" }` | `{ "user": { "id", "tipo" } }` |
| `/auth/verificar-email` | `GET` | Checa disponibilidade de e-mail. | `query: ?email=...` | `{ "disponivel": true/false }` |

### 2. Perfil e Biometria

| Rota | Método | Descrição | Body (JSON) | Resposta (200) |
| --- | --- | --- | --- | --- |
| `/perfil/:usuarioId` | `GET` | Retorna IMC e Ofensivas atuais. | N/A | `{ "imc", "ofensivaAtual", "pesoAtual" }` |
| `/perfil/biometria` | `PUT` | Atualiza peso/altura do usuário. | `{ "usuarioId", "peso", "altura" }` | `{ "message": "Dados atualizados" }` |
| `/perfil/verificar-ofensiva` | `POST` | Força a validação da streak diária. | `{ "usuarioId" }` | `{ "message": "Verificação concluída" }` |

### 3. Gestão de Hábitos

| Rota | Método | Descrição | Body (JSON) | Resposta |
| --- | --- | --- | --- | --- |
| `/habitos` | `POST` | Cria novo hábito personalizado. | `{ "perfilId", "nome", "metaAlvo", "frequencia" }` | `{ "id": 12 }` |
| `/habitos/perfil/:perfilId` | `GET` | Lista todos os hábitos ativos. | N/A | `Array de Habitos[]` |
| `/habitos/:id` | `PUT` | Edita configurações do hábito. | `{ "nome", "metaAlvo", "frequencia", ... }` | `{ "message": "Sucesso" }` |
| `/habitos/:id` | `DELETE` | Arquiva (desativa) o hábito. | N/A | `{ "message": "Arquivado" }` |

### 4. Registro de Progresso

| Rota | Método | Descrição | Body (JSON) | Resposta |
| --- | --- | --- | --- | --- |
| `/registros` | `POST` | Insere progresso (ex: bebi 500ml). | `{ "habitoId", "usuarioId", "qtdRealizada" }` | `{ "message": "Progresso salvo" }` |
| `/registros/perfil/:id/data/:dt` | `GET` | Lista histórico de um dia específico. | N/A (parâmetros na URL) | `Array de Registros[]` |

### 5. Painel Administrativo

| Rota | Método | Descrição | Body (JSON) | Resposta |
| --- | --- | --- | --- | --- |
| `/admin/usuarios` | `POST` | Admin cadastra usuário (senha aleatória). | `{ "email", "nome", "adminId" }` | `{ "senhaTemporaria": "..." }` |
| `/admin/usuarios/resetar-senha` | `PATCH` | Gera nova senha para o usuário. | `{ "adminId", "usuarioId" }` | `{ "novaSenha": "..." }` |
| `/admin/estatisticas` | `GET` | Total de usuários e hábitos no sistema. | N/A | `{ "usuariosCadastrados", "habitos" }` |

---

## 🛠 Como Rodar o Projeto

1. Clone o repositório.
2. Configure o arquivo `.env` com as credenciais do seu MySQL.
3. Instale as dependências: `npm install`.
4. Inicie o banco de dados (o script `initializeDatabase` rodará automaticamente, adicionando tabelas).
5. Execute: `npm run dev`.
