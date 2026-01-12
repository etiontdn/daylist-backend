import pool from "../database";
import { RegistroHabito } from "../models/RegistroHabito";
import { StatusHabitoEnum, FrequenciaEnum } from "../models/enums";
import { HabitoService } from "./HabitoService";

export class RegistroHabitoService {
    private habitoService: HabitoService;

    constructor() {
        this.habitoService = new HabitoService();
    }

    /**
     * Função auxiliar para encontrar a segunda-feira da semana de uma data
     */
    private obterInicioDaSemana(data: Date): string {
        const d = new Date(data);
        const dia = d.getDay();
        const diff = d.getDate() - dia + (dia === 0 ? -6 : 1); // Ajusta para segunda-feira
        const segunda = new Date(d.setDate(diff));
        return segunda.toISOString().split("T")[0];
    }
    /**
     * Regista ou atualiza o progresso de um hábito para uma data específica (normalmente hoje)
     */
    public async registarProgresso(
        habitoId: number,
        qtdRealizada: number,
        dataStr: string
    ): Promise<void> {
        const habito = await this.habitoService.buscarPorId(habitoId);
        if (!habito) throw new Error("Hábito não encontrado.");

        let dataReferencia = dataStr;

        // SE O HÁBITO FOR SEMANAL: Normalizamos para o início da semana
        if (habito.frequencia === FrequenciaEnum.SEMANAL) {
            dataReferencia = this.obterInicioDaSemana(new Date(dataStr));
        }

        // 1. Verificar se já existe um registro para esse período (dia ou semana)
        const [existente]: any = await pool.query(
            "SELECT qtdRealizada FROM RegistrosHabito WHERE habito_id = ? AND dataReferencia = ?",
            [habitoId, dataReferencia]
        );

        // 2. Calculamos a nova quantidade total (Acumulada)
        const qtdAnterior =
            existente.length > 0 ? existente[0].qtdRealizada : 0;
        const novaQtdTotal = qtdAnterior + qtdRealizada;

        // 3. Definir status baseado na meta do hábito
        let status = StatusHabitoEnum.PENDENTE;
        if (novaQtdTotal >= habito.metaAlvo) {
            status = StatusHabitoEnum.CONCLUIDO;
        } else if (novaQtdTotal > 0) {
            status = StatusHabitoEnum.PARCIAL;
        }

        // 4. Salvar (Upsert)
        await pool.query(
            `INSERT INTO RegistrosHabito (habito_id, dataReferencia, qtdRealizada, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE qtdRealizada = ?, status = ?`,
            [
                habitoId,
                dataReferencia,
                novaQtdTotal,
                status,
                novaQtdTotal,
                status,
            ]
        );
    }

    /**
     * Procura todos os registos de um perfil numa data específica
     * Útil para carregar a lista de "checks" do dia
     */
    public async buscarRegistrosPorData(
        perfilId: number,
        data: string
    ): Promise<RegistroHabito[]> {
        const [rows]: any = await pool.query(
            `SELECT r.* FROM RegistrosHabito r
             INNER JOIN Habitos h ON r.habito_id = h.id
             WHERE h.perfil_id = ? AND r.dataReferencia = ?`,
            [perfilId, data]
        );

        return rows.map((row: any) => new RegistroHabito(row));
    }

    /**
     * Busca especificamente os registos de ONTEM para validar a ofensiva (Streak)
     */
    public async buscarRegistrosDeOntem(
        perfilId: number
    ): Promise<RegistroHabito[]> {
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        const dataFormatada = ontem.toISOString().split("T")[0];

        return this.buscarRegistrosPorData(perfilId, dataFormatada);
    }
}
