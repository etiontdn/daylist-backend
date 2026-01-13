import { Request, Response } from 'express';
import { HabitoService } from '../services/HabitoService';
import { FrequenciaEnum } from '../models/enums';

export class HabitoController {
  private habitoService: HabitoService;

  constructor() {
    this.habitoService = new HabitoService();
  }

  /**
   * POST /habitos
   * Cria um novo hábito para o perfil do usuário
   */
  public criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { perfilId, nome, categoria, frequencia, unidadeMedida, metaAlvo, motivacao } = req.body;

      if (!perfilId || !nome || !metaAlvo) {
        return res.status(400).json({ message: "Dados essenciais faltando (perfilId, nome ou meta)." });
      }

      const novoId = await this.habitoService.criarHabito(perfilId, {
        nome, categoria, frequencia, unidadeMedida, metaAlvo, motivacao
      });

      return res.status(201).json({ message: "Hábito criado com sucesso!", id: novoId });
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao criar hábito: " + error.message });
    }
  };

  /**
   * GET /habitos/perfil/:perfilId
   * Lista todos os hábitos ATIVOS de um perfil específico
   */
  public listarPorPerfil = async (req: Request, res: Response): Promise<Response> => {
    try {
      const perfilId = parseInt((req.params.perfilId as string));
      const habitos = await this.habitoService.listarPorPerfil(perfilId);
      
      return res.status(200).json(habitos);
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao listar hábitos." });
    }
  };

  /**
   * PUT /habitos/:id
   * Edita as informações de um hábito existente
   */
  public atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt((req.params.id as string));
      const { nome, metaAlvo, motivacao, frequencia, categoria, unidadeMedida } = req.body;

      await this.habitoService.atualizarHabito(
        id, nome, metaAlvo, motivacao, frequencia as FrequenciaEnum, categoria, unidadeMedida
      );

      return res.status(200).json({ message: "Hábito atualizado com sucesso!" });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };

  /**
   * DELETE /habitos/:id
   * Arquiva um hábito (muda o status para inativo)
   */
  public arquivar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt((req.params.id as string));
      await this.habitoService.arquivarHabito(id);
      
      return res.status(200).json({ message: "Hábito arquivado com sucesso." });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };
}