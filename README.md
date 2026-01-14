# Daylist API

**Sistema de Gestão de Hábitos e Gamificação de Saúde**

Este projeto é uma API REST desenvolvida para auxiliar usuários a monitorar hábitos diários e semanais, promovendo uma vida mais saudável através de mecânicas de persistência (Ofensivas/Streaks).

### Tecnologias Utilizadas

* **Runtime:** Node.js com TypeScript
* **Framework:** Express
* **Banco de Dados:** MySQL
* **Segurança:** Bcrypt para hashing de senhas

---

## Documentação da API
Para completar a sua documentação, preparei uma tabela detalhada que serve como um guia rápido para testes. Esta tabela traduz o arquivo de rotas em especificações de entrada e saída.

### 1. Autenticação e Usuários

| Rota | Método | Descrição | Parâmetros/Corpo (JSON) | Resposta Esperada (200/201) |
| --- | --- | --- | --- | --- |
| `/auth/registrar` | `POST` | Cria conta e 3 hábitos iniciais. | `{"email", "senha"}` | `{"message", "data"}` |
| `/auth/login` | `POST` | Valida acesso e retorna tipo. | `{"email", "senha"}` | `{"user": {"id", "tipo"}}` |
| `/auth/verificar-email` | `GET` | Checa se e-mail já existe. | `?email=teste@teste.com` | `{"disponivel": true}` |

### 2. Perfil

| Rota | Método | Descrição | Parâmetros/Corpo (JSON) | Resposta Esperada (200) |
| --- | --- | --- | --- | --- |
| `/perfil/:usuarioId` | `GET` | Dashboard (IMC e Ofensiva). | `ID na URL` | `{"imc", "ofensivaAtual"}` |
| `/perfil/biometria` | `PUT` | Atualiza Peso e Altura. | `{"usuarioId", "peso", "altura"}` | `{"message": "Sucesso"}` |
| `/perfil/verificar-ofensiva` | `POST` | Valida metas diárias. | `{"usuarioId"}` | `{"message": "Concluída"}` |

### 3. Administração

| Rota | Método | Descrição | Parâmetros/Corpo (JSON) | Resposta Esperada |
| --- | --- | --- | --- | --- |
| `/admin/usuarios` | `POST` | Admin cria novo usuário. | `{"email", "nome", "adminId"}` | `{"senhaTemporaria"}` |
| `/admin/usuarios/resetar-senha` | `PATCH` | Força nova senha aleatória. | `{"adminId", "usuarioId"}` | `{"novaSenha"}` |
| `/admin/estatisticas` | `GET` | Métricas globais do app. | N/A | `{"usuariosCadastrados"}` |
| `/admin/usuarios/:id` | `GET` | Detalhes de um usuário. | `ID na URL` | `{"id", "email", "tipo"}` |

### 4. Gestão de Hábitos

| Rota | Método | Descrição | Parâmetros/Corpo (JSON) | Resposta Esperada |
| --- | --- | --- | --- | --- |
| `/habitos` | `POST` | Cria hábito customizado. | `{"perfilId", "nome", "categoria", "frequencia", "unidadeMedida", "metaAlvo", "motivacao"}` | `{"id": 1}` |
| `/habitos/perfil/:perfilId` | `GET` | Lista hábitos ativos. | `perfilId na URL` | `Array de Habito[]` |
| `/habitos/:id` | `PUT` | Edita dados do hábito. | `{"nome", "categoria", "frequencia", "unidadeMedida", "metaAlvo", "motivacao"}` | `{"message": "Sucesso"}` |
| `/habitos/:id` | `DELETE` | Arquiva (desativa) hábito. | `ID na URL` | `{"message": "Arquivado"}` |

### 5. Registro de Atividades

| Rota | Método | Descrição | Parâmetros/Corpo (JSON) | Resposta Esperada |
| --- | --- | --- | --- | --- |
| `/registros` | `POST` | Salva progresso diário/semanal. | `{"habitoId", "usuarioId", "qtdRealizada"}` | `{"message": "Registrado"}` |
| `/registros/perfil/:perfilId/data/:data` | `GET` | Histórico de um dia. | `perfilId` e `data (YYYY-MM-DD)` | `Array de Registro[]` |

## Como Rodar o Projeto

### Passo 1: Configurar as Variáveis de Ambiente

Na raiz do seu projeto, crie um arquivo chamado **`.env`**. Preencha-o com as suas credenciais do MySQL.

**Importante:** Certifique-se de que o usuário e a senha coincidam com os configurados no seu servidor local (ou crie o usuário conforme os dados abaixo).

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=daylist
DB_USERNAME=daylist-admin
DB_PASSWORD=daylist-admin

```

---

### Passo 2: Preparar o MySQL

Antes de rodar o código, você precisa garantir que o banco de dados especificado no `.env` exista. Abra o seu terminal do MySQL ou o **MySQL Workbench** e execute os seguintes comandos:

```sql
-- 1. Criar o Banco de Dados
CREATE DATABASE IF NOT EXISTS daylist;

-- 2. Criar o Usuário Administrativo (conforme seu .env)
CREATE USER 'daylist-admin'@'localhost' IDENTIFIED BY 'daylist-admin';

-- 3. Dar todas as permissões ao usuário para este banco
GRANT ALL PRIVILEGES ON daylist.* TO 'daylist-admin'@'localhost';

-- 4. Aplicar as alterações
FLUSH PRIVILEGES;

```

### Passo 3: Execute.

1. Instale as dependências: `npm install`.
2. Execute: `npm run dev`.
