import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor() {
        this.usuarioService = new UsuarioService();
    }

    /**
     * POST /auth/registrar
     * Rota para novos usuários (Clientes) se cadastrarem
     */
    public registrar = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { email, name, senha } = req.body;

            // Validação básica de entrada
            if (!email || !senha) {
                return res
                    .status(400)
                    .json({ message: "E-mail e senha são obrigatórios." });
            }

            const resultado =
                await this.usuarioService.cadastrarComHabitosIniciais(
                    email,
                    name,
                    senha
                );

            return res.status(201).json({
                message:
                    "Usuário criado com sucesso! Seus hábitos iniciais já estão prontos.",
                data: resultado,
            });
        } catch (error: any) {
            // Tratamento de erro específico para e-mail duplicado
            if (error.message.includes("em uso")) {
                return res.status(400).json({ message: error.message });
            }

            console.error("Erro no Registro:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao processar o cadastro." });
        }
    };

    /**
     * POST /auth/login
     * Autentica o usuário e retorna seus dados básicos
     */
    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res
                    .status(400)
                    .json({ message: "E-mail e senha são obrigatórios." });
            }

            const usuario = await this.usuarioService.login(email, senha);

            if (!usuario) {
                return res
                    .status(401)
                    .json({ message: "E-mail ou senha inválidos." });
            }

            // Retornamos os dados para o frontend salvar na sessão/localStorage
            return res.status(200).json({
                message: "Login realizado com sucesso",
                user: {
                    id: usuario.id,
                    email: usuario.email,
                    tipo: usuario.tipo_usuario,
                },
            });
        } catch (error: any) {
            console.error("Erro no Login:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao processar o login." });
        }
    };

    /**
     * GET /auth/verificar-email
     * Rota auxiliar para checagem em tempo real no frontend
     */
    public verificarEmail = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { email } = req.query;

            if (!email) {
                return res
                    .status(400)
                    .json({ message: "E-mail não fornecido." });
            }

            const emUso = await this.usuarioService.emailEmUso(email as string);
            return res.status(200).json({ disponivel: !emUso });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Erro ao verificar e-mail." });
        }
    };
}
