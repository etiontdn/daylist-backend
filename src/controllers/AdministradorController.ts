import { Request, Response } from 'express';
import { AdministradorService } from '../services/AdministradorService';

export class AdministradorController {
  private adminService: AdministradorService;

  constructor() {
    this.adminService = new AdministradorService();
  }

  /**
   * POST /admin/usuarios
   * Permite que o Admin cadastre um novo usuário com senha aleatória
   */
  public cadastrarUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, nome, adminId } = req.body;

      if (!email || !nome || !adminId) {
        return res.status(400).json({ message: "Dados incompletos para cadastro." });
      }

      const novoUsuario = await this.adminService.cadastrarUsuario(email, nome, adminId);

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso pelo administrador.",
        data: novoUsuario
      });
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  };

  /**
   * PATCH /admin/usuarios/resetar-senha
   * Gera uma nova senha aleatória para um usuário específico
   */
  public resetarSenha = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { adminId, usuarioId } = req.body;

      if (!adminId || !usuarioId) {
        return res.status(400).json({ message: "IDs de administrador e usuário são necessários." });
      }

      const novaSenha = await this.adminService.resetarSenha(adminId, usuarioId);

      return res.status(200).json({
        message: "Senha resetada com sucesso.",
        novaSenha: novaSenha // O Admin deve comunicar esta senha ao usuário
      });
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  };

  /**
   * GET /admin/estatisticas
   * Retorna métricas globais do sistema para o Dashboard administrativo
   */
  public obterEstatisticas = async (req: Request, res: Response): Promise<Response> => {
    try {
      const estatisticas = await this.adminService.buscarEstatisticasSistema();
      return res.status(200).json(estatisticas);
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao buscar estatísticas." });
    }
  };

  /**
   * GET /admin/usuarios/:id
   * Busca detalhes de um usuário específico para auditoria
   */
  public visualizarUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt((req.params.id as string));
      const usuario = await this.adminService.buscarUsuarioPorId(id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(200).json({
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao buscar usuário." });
    }
  };
}