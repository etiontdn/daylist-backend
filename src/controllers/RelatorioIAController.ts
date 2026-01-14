import { Request, Response } from 'express';
import { RelatorioIAService } from '../services/RelatorioIAService';

export class RelatorioIAController {
    private service: RelatorioIAService;

    constructor() {
        this.service = new RelatorioIAService();
    }

    public gerar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { usuarioId, dataInicio, dataFim } = req.body;
            if (!usuarioId) return res.status(400).json({ message: "usuarioId é obrigatório" });

            const relatorio = await this.service.gerarRelatorioSemanal(usuarioId, new Date(dataInicio), new Date(dataFim));
            return res.status(201).json(relatorio.toJSON());
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao gerar IA: " + error.message });
        }
    };

    public listar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuarioId = parseInt(req.params.usuarioId as string);
            const relatorios = await this.service.listarPorUsuario(usuarioId);
            return res.status(200).json(relatorios);
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao listar relatórios." });
        }
    };
}