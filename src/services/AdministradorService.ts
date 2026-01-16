import pool from "../database";
import { Administrador } from "../models/Administrador";
import { Usuario } from "../models/Usuario";
import { TipoUsuarioEnum } from "../models/enums";
import { UsuarioService } from "./UsuarioService";

export class AdministradorService {
    private usuarioService: UsuarioService;

    constructor() {
        this.usuarioService = new UsuarioService();
    }

    /**
     * Permite que o Administrador cadastre um novo usuário manualmente.
     */
    public async cadastrarUsuario(email: string, nome: string, adminId: number) {
        // 1. Checagem de Autorização
        const [adminCheck]: any = await pool.query("SELECT tipo_usuario FROM Usuarios WHERE id = ?", [adminId]);
        if (adminCheck[0]?.tipo_usuario !== 'ADMIN') {
            throw new Error("Ação não permitida. Apenas administradores podem cadastrar usuários.");
        }

        // 2. Reutilizando o Service de Usuário para checagem de existência
        const jaExiste = await this.usuarioService.emailEmUso(email);
        if (jaExiste) {
            throw new Error("Este e-mail já está sendo utilizado por outro usuário.");
        }

        // 3. Chamada ao Modelo: O Admin cria a instância
        const adminModel = new Administrador({ id: adminId });
        const novoUsuario: Usuario = adminModel.cadastrarUsuario(email, nome);

        // 4. Gerar Senha Inicial Aleatória
        const senhaAleatoria = adminModel.resetarSenhaUsuario(0); 
        await novoUsuario.alterarSenha(senhaAleatoria);

        // 5. Escrita no Banco de Dados
        const [result]: any = await pool.query(
            "INSERT INTO Usuarios (name, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?)",
            [novoUsuario.name, novoUsuario.email, novoUsuario.senha_hash, TipoUsuarioEnum.CLIENTE]
        );

        // 6. Criar Perfil Básico
        await pool.query(
            "INSERT INTO Perfis (usuario_id, ofensivaAtual, maiorOfensiva) VALUES (?, 0, 0)",
            [result.insertId]
        );

        return {
            id: result.insertId,
            email: novoUsuario.email,
            senhaTemporaria: senhaAleatoria
        };
    }
    
    public async buscarUsuarioPorId(id: number): Promise<Usuario | null> {
        const [rows]: any = await pool.query(
            "SELECT * FROM Usuarios WHERE id = ?",
            [id]
        );
        if (rows.length === 0) return null;
        return new Usuario(rows[0]);
    }

    public async resetarSenha(adminId: number, usuarioId: number) {
        const admin = new Administrador();
        const novaSenha = admin.resetarSenhaUsuario(usuarioId);
        const userModel = new Usuario();
        await userModel.alterarSenha(novaSenha);
        await pool.query("UPDATE Usuarios SET senha_hash = ? WHERE id = ?", [
            userModel.senha_hash,
            usuarioId,
        ]);

        return novaSenha;
    }

    /**
     * Retorna estatísticas globais para o Dashboard do Admin
     */
    public async buscarEstatisticasSistema() {
        const [totalUsers]: any = await pool.query(
            "SELECT COUNT(*) as total FROM Usuarios"
        );
        const [totalHabitos]: any = await pool.query(
            "SELECT COUNT(*) as total FROM Habitos"
        );

        return {
            usuariosCadastrados: totalUsers[0].total,
            habitosMonitorados: totalHabitos[0].total,
        };
    }
}
