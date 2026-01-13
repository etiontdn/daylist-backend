import { Request, Response } from 'express';
import { PerfilService } from '../services/PerfilService';

export class PerfilController {
  private perfilService: PerfilService;

  constructor() {
    this.perfilService = new PerfilService();
  }

  /**
   * GET /perfil/:usuarioId
   * Retorna os dados completos e o resumo de saúde (IMC, etc)
   */
  public obterPerfil = async (req: Request, res: Response): Promise<Response> => {
    try {
      const usuarioId = parseInt((req.params.usuarioId as string));

      if (isNaN(usuarioId)) {
        return res.status(400).json({ message: "ID de usuário inválido." });
      }

      const resumo = await this.perfilService.obterResumoSaude(usuarioId);
      
      return res.status(200).json(resumo);
    } catch (error: any) {
      console.error("Erro ao obter perfil:", error);
      return res.status(404).json({ message: error.message || "Perfil não encontrado." });
    }
  };

  /**
   * PUT /perfil/biometria
   * Atualiza peso e altura e dispara o recálculo do IMC
   */
  public atualizarBiometria = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuarioId, peso, altura, dataNascimento, sexo } = req.body;

      if (!usuarioId || !peso || !altura) {
        return res.status(400).json({ message: "Usuário, peso e altura são obrigatórios." });
      }

      await this.perfilService.atualizarBiometria(usuarioId, peso, altura, dataNascimento, sexo);

      return res.status(200).json({ message: "Dados biométricos atualizados com sucesso!" });
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao atualizar dados: " + error.message });
    }
  };

  /**
   * POST /perfil/verificar-ofensiva
   * Rota que pode ser chamada manualmente ou após registrar um hábito
   */
  public checarOfensiva = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuarioId, data } = req.body;

      if (!usuarioId) {
        return res.status(400).json({ message: "ID do usuário é necessário." });
      } if (isNaN(Date.parse(data))) {
        return res.status(400).json({ message: "Data inválida." });
      }

      if (await this.perfilService.processarVerificacaoOfensiva(usuarioId, new Date(data))) {
        return res.status(200).json({ message: "Ofensiva incrementada!", value: true });
      } else {
        return res.status(200).json({ message: "Nenhuma mudança na ofensiva.", value: false });
      }
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao processar ofensiva." });
    }
  };
}