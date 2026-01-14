import pool from "../database";
import { Administrador } from "../models/Administrador";
import { Usuario } from "../models/Usuario";
import { FrequenciaEnum } from "../models/enums";

export class UsuarioService {
    /**
     * Checa se um e-mail já está cadastrado no banco de dados.
     */
    public async emailEmUso(email: string): Promise<boolean> {
        const [rows]: any = await pool.query(
            "SELECT id FROM Usuarios WHERE email = ? LIMIT 1",
            [email]
        );
        return rows.length > 0;
    }

    /**
     * Cria um fluxo completo de boas-vindas: Usuário -> Perfil -> Hábitos Iniciais
     */
    public async cadastrarComHabitosIniciais(
        email: string,
        name: string,
        senhaPlana: string
    ) {
        const jaExiste = await this.emailEmUso(email);
        if (jaExiste) {
            throw new Error("Este e-mail já está em uso.");
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Criar instância do Model e gerar Hash da senha
            const novoUsuario = new Usuario();
            novoUsuario.email = email;
            novoUsuario.name = name;
            await novoUsuario.alterarSenha(senhaPlana);

            // 2. Inserir Usuário
            const [userRes]: any = await connection.query(
                "INSERT INTO Usuarios (email, name, senha_hash, tipo_usuario) VALUES (?, ?, ?, 'CLIENTE')",
                [novoUsuario.email, novoUsuario.name, novoUsuario.senha_hash]
            );
            const usuarioId = userRes.insertId;

            // 3. Criar o Perfil vinculado
            const [perfilRes]: any = await connection.query(
                "INSERT INTO Perfis (usuario_id, ofensivaAtual, maiorOfensiva) VALUES (?, 0, 0)",
                [usuarioId]
            );
            const perfilId = perfilRes.insertId;

            // 4. Inserir Hábitos Iniciais
            const habitosIniciais = [
                {
                    nome: "Beber 2L de Água",
                    cat: "Saúde",
                    freq: FrequenciaEnum.DIARIO,
                    meta: 2,
                    unidade: "Litros",
                },
                {
                    nome: "Caminhada 15 min",
                    cat: "Exercício",
                    freq: FrequenciaEnum.DIARIO,
                    meta: 15,
                    unidade: "Minutos",
                },
                {
                    nome: "Meditação",
                    cat: "Mente",
                    freq: FrequenciaEnum.DIARIO,
                    meta: 1,
                    unidade: "Sessão",
                },
            ];

            for (const habito of habitosIniciais) {
                await connection.query(
                    `INSERT INTO Habitos (perfil_id, nome, categoria, frequencia, unidadeMedida, metaAlvo, ativo) 
                     VALUES (?, ?, ?, ?, ?, ?, true)`,
                    [
                        perfilId,
                        habito.nome,
                        habito.cat,
                        habito.freq,
                        habito.unidade,
                        habito.meta,
                    ]
                );
            }

            await connection.commit();

            return {
                userId: usuarioId,
                perfilId: perfilId,
                email: email,
            };
        } catch (error: any) {
            await connection.rollback();
            throw new Error(`Falha ao processar cadastro: ${error.message}`);
        } finally {
            connection.release();
        }
    }

    /**
     * Valida credenciais de login
     */
    // Exemplo dentro de um Service de Login
    public async login(email: string, senhaPlana: string) {
        const [rows]: any = await pool.query(
            "SELECT * FROM Usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) return null;

        const dadosBanco = rows[0];
        let usuario: Usuario;

        if (dadosBanco.tipo_usuario === "ADMIN") {
            usuario = new Administrador(dadosBanco);
        } else {
            usuario = new Usuario(dadosBanco);
        }

        const senhaValida = await usuario.autenticar(senhaPlana);
        return senhaValida ? usuario : null;
    }

    /**
     * Retorna o ID do perfil vinculado a um ID de usuário específico.
     */
    public async buscarPerfilIdPorUsuario(
        usuarioId: number
    ): Promise<number | null> {
        try {
            const [rows]: any = await pool.query(
                "SELECT id FROM Perfis WHERE usuario_id = ? LIMIT 1",
                [usuarioId]
            );

            if (rows.length === 0) {
                return null;
            }

            return rows[0].id;
        } catch (error: any) {
            throw new Error(`Erro ao buscar perfil: ${error.message}`);
        }
    }
}
