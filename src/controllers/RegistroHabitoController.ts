import { Request, Response } from 'express';
import { RegistroHabitoService } from '../services/RegistroHabitoService';
import { PerfilService } from '../services/PerfilService';

export class RegistroHabitoController {
  private registroService: RegistroHabitoService;
  private perfilService: PerfilService;

  constructor() {
    this.registroService = new RegistroHabitoService();
    this.perfilService = new PerfilService();
  }

  /**
   * POST /registros
   * Registra o progresso de um hábito e atualiza a ofensiva do usuário
   */
  public registrarProgresso = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { habitoId, usuarioId, qtdRealizada, data } = req.body;

      // 1. Validação de entrada
      if (!habitoId || !usuarioId || qtdRealizada === undefined) {
        return res.status(400).json({ message: "Dados insuficientes para o registro." });
      }

      // Usa a data atual se nenhuma for enviada (formato YYYY-MM-DD)
      const dataRegistro = data || new Date().toISOString().split('T')[0];

      // 2. Salva o progresso (O Service calcula se é PENDENTE, PARCIAL ou CONCLUIDO)
      await this.registroService.registarProgresso(habitoId, qtdRealizada, dataRegistro);

      // 3. Após registrar, dispara a verificação de ofensiva para atualizar o "foguinho"
      await this.perfilService.processarVerificacaoOfensiva(usuarioId, dataRegistro);

      return res.status(200).json({ 
        message: "Progresso registrado e ofensiva atualizada!" 
      });

    } catch (error: any) {
      console.error("Erro ao registrar progresso:", error);
      return res.status(500).json({ message: "Erro interno: " + error.message });
    }
  };

  /**
   * GET /registros/perfil/:perfilId/data/:data
   * Lista o status de todos os hábitos de um dia específico
   */
  public listarPorData = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { perfilId, data } = req.params;
      
      const registros = await this.registroService.buscarRegistrosPorData(
        parseInt((perfilId as string)), 
        (data as string)
      );

      return res.status(200).json(registros);
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao buscar registros." });
    }
  };
}