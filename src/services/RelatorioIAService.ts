import pool from "../database";
import { RelatorioIA } from "../models/RelatorioIA";
import { PerfilService } from "./PerfilService";

export class RelatorioIAService {
    private perfilService: PerfilService;

    constructor() {
        this.perfilService = new PerfilService();
    }

    /**
     * Gera um novo relatório usando IA para um período específico
     */
    public async gerarRelatorioSemanal(usuarioId: number, dataInicio: Date, dataFim: Date): Promise<RelatorioIA> {

        const dataFimStr = dataFim.toISOString().split('T')[0];
        const dataInicioStr = dataInicio.toISOString().split('T')[0];

        const perfil = await this.perfilService.buscarPorUsuarioId(usuarioId);
        if (!perfil) throw new Error("Perfil não encontrado.");

        const [dadosBrutos]: any = await pool.query(`
            SELECT h.nome, h.metaAlvo, r.qtdRealizada, r.status, r.dataReferencia
            FROM Habitos h
            LEFT JOIN RegistrosHabito r ON h.id = r.habito_id
            WHERE h.perfil_id = ? AND r.dataReferencia BETWEEN ? AND ?
        `, [perfil.id, dataInicioStr, dataFimStr]);

        const contextoParaIA = {
            perfil: `Peso: ${perfil.pesoKg}kg, Altura: ${perfil.alturaCm}cm, Ofensiva Atual: ${perfil.ofensivaAtual}`,
            habitos: Array.from(new Set(dadosBrutos.map((d: any) => d.nome))).join(", "),
            registros: JSON.stringify(dadosBrutos)
        };

        const relatorio = new RelatorioIA({
            dataInicio: dataInicio,
            dataFim: dataFim
        });

        await relatorio.gerar(contextoParaIA);

        const [result]: any = await pool.query(
            `INSERT INTO RelatoriosIA (perfil_id, textoAnalise, dataInicio, dataFim) 
             VALUES (?, ?, ?, ?)`,
            [perfil.id, relatorio.textoAnalise, dataInicioStr, dataFimStr]
        );

        const relatorioFinal = new RelatorioIA({
            ...relatorio.toJSON(),
            id: result.insertId
        });

        return relatorioFinal;
    }

    /**
     * Busca o histórico de relatórios de um usuário
     */
    public async listarPorUsuario(usuarioId: number): Promise<RelatorioIA[]> {
        // Primeiro, precisamos descobrir qual o perfil_id deste usuarioId
        const perfil = await this.perfilService.buscarPorUsuarioId(usuarioId);
        if (!perfil) throw new Error("Perfil não encontrado.");

        const [rows]: any = await pool.query(
            "SELECT * FROM RelatoriosIA WHERE perfil_id = ? ORDER BY dataGeracao DESC",
            [perfil.id]
        );

        // Map para transformar as linhas do BD em instâncias da classe RelatorioIA
        return rows.map((row: any) => new RelatorioIA({
            id: row.id,
            textoAnalise: row.textoAnalise,
            dataInicio: row.dataInicio,
            dataFim: row.dataFim,
            dataGeracao: row.dataGeracao
        }));
    }
}