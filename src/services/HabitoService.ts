import pool from "../database";
import { FrequenciaEnum } from "../models/enums";
import { Habito } from "../models/Habito";

export class HabitoService {
    /**
     * Cria um novo hábito vinculado a um perfil
     */
    public async criarHabito(perfilId: number, dados: any): Promise<number> {
        const novoHabito = new Habito(dados);

        const [result]: any = await pool.query(
            `INSERT INTO Habitos 
            (perfil_id, nome, categoria, frequencia, unidadeMedida, metaAlvo, ativo, motivacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                perfilId,
                novoHabito.nome,
                novoHabito.categoria,
                novoHabito.frequencia,
                novoHabito.unidadeMedida,
                novoHabito.metaAlvo,
                novoHabito.ativo,
                novoHabito.motivacao,
            ]
        );

        return result.insertId;
    }

    /**
     * Lista todos os hábitos ativos de um perfil
     */
    public async listarPorPerfil(perfilId: number): Promise<Habito[]> {
        const [rows]: any = await pool.query(
            "SELECT * FROM Habitos WHERE perfil_id = ? AND ativo = true",
            [perfilId]
        );

        // Mapeia os resultados do banco para instâncias da classe Habito
        return rows.map((row: any) => new Habito(row));
    }

    /**
     * Busca um hábito específico pelo ID
     */
    public async buscarPorId(id: number): Promise<Habito | null> {
        const [rows]: any = await pool.query(
            "SELECT * FROM Habitos WHERE id = ?",
            [id]
        );

        if (rows.length === 0) return null;

        return new Habito(rows[0]);
    }

    /**
     * Atualiza os dados de um hábito
     */
    public async atualizarHabito(
        id: number,
        nome: string,
        metaAlvo: number,
        motivacao: string,
        frequencia: FrequenciaEnum,
        categoria: string,
        unidadeMedida: string
    ): Promise<void> {
        // 1. Busca o hábito atual no banco
        const habitoData = await this.buscarPorId(id);
        if (!habitoData) throw new Error("Hábito não encontrado.");

        // 2. Aplica a lógica de edição no Model (encapsulamento)
        habitoData.editar(
            nome,
            metaAlvo,
            motivacao,
            frequencia,
            categoria,
            unidadeMedida
        );

        // 3. Persiste as mudanças no banco de dados
        await pool.query(
            `UPDATE Habitos SET 
                nome = ?, 
                metaAlvo = ?, 
                motivacao = ?, 
                frequencia = ?, 
                categoria = ?, 
                unidadeMedida = ? 
             WHERE id = ?`,
            [
                habitoData.nome,
                habitoData.metaAlvo,
                habitoData.motivacao,
                habitoData.frequencia,
                habitoData.categoria,
                habitoData.unidadeMedida,
                id,
            ]
        );
    }

    /**
     * Desativa um hábito (Arquivamento conforme o diagrama)
     */
    public async arquivarHabito(id: number): Promise<void> {
        const habitoData = await this.buscarPorId(id);
        if (!habitoData) throw new Error("Hábito não encontrado.");

        // Muda o estado no Model
        habitoData.arquivar();

        await pool.query("UPDATE Habitos SET ativo = ? WHERE id = ?", [
            habitoData.ativo,
            id,
        ]);
    }
}
