import pool from "../database";
import { FrequenciaEnum } from "../models/enums";
import { Perfil } from "../models/Perfil";
import { RegistroHabito } from "../models/RegistroHabito";

export class PerfilService {
    /**
     * Busca o perfil completo de um usuário através do seu ID de usuário
     */
    public async buscarPorUsuarioId(usuarioId: number): Promise<Perfil | null> {
        const [rows]: any = await pool.query(
            "SELECT * FROM Perfis WHERE usuario_id = ?",
            [usuarioId]
        );

        if (rows.length === 0) return null;

        // Instancia o modelo com os dados do banco
        return new Perfil(rows[0]);
    }

    /**
     * Atualiza dados biométricos (Peso e Altura) e recalcula o IMC
     */
    public async atualizarBiometria(
        usuarioId: number,
        peso: number,
        altura: number
    ): Promise<void> {
        // 1. Instanciamos o modelo para usar a lógica de negócio (como o cálculo de IMC se necessário)
        const perfilData = await this.buscarPorUsuarioId(usuarioId);

        if (!perfilData) {
            throw new Error("Perfil não encontrado para este usuário.");
        }

        // 2. Usamos o método do Model para validar/atualizar os dados no objeto
        perfilData.atualizarDados(peso, altura);

        // 3. Persistimos no banco de dados
        await pool.query(
            "UPDATE Perfis SET pesoKg = ?, alturaCm = ? WHERE usuario_id = ?",
            [perfilData.pesoKg, perfilData.alturaCm, usuarioId]
        );
    }

    /**
     * Retorna os dados resumidos de saúde para o dashboard
     */
    public async obterResumoSaude(usuarioId: number) {
        const perfil = await this.buscarPorUsuarioId(usuarioId);

        if (!perfil) throw new Error("Perfil não encontrado.");

        return {
            imc: perfil.calcularIMC().toFixed(2),
            ofensivaAtual: perfil.ofensivaAtual,
            maiorOfensiva: perfil.maiorOfensiva,
            pesoAtual: perfil.pesoKg,
            alturaAtual: perfil.alturaCm,
        };
    }

    /**
     * Incrementa a ofensiva do usuário (chamado quando ele conclui todos os hábitos do dia)
     */
    public async incrementarOfensiva(perfilId: number): Promise<void> {
        const [rows]: any = await pool.query(
            "SELECT ofensivaAtual, maiorOfensiva FROM Perfis WHERE id = ?",
            [perfilId]
        );

        if (rows.length > 0) {
            let novaOfensiva = rows[0].ofensivaAtual + 1;
            let novaMaior = rows[0].maiorOfensiva;

            if (novaOfensiva > novaMaior) {
                novaMaior = novaOfensiva;
            }

            await pool.query(
                "UPDATE Perfis SET ofensivaAtual = ?, maiorOfensiva = ? WHERE id = ?",
                [novaOfensiva, novaMaior, perfilId]
            );
        }
    }

    /**
     * Serviço que verifica e atualiza a ofensiva do usuário.
     * Pode ser chamado ao completar uma meta ou por uma rotina de final de dia.
     * @return Retorna true se a verificação ter sucedido e incrementado a ofensiva
     * e false se ainda faltar algum hábito diário a ser cumprido.
     */
    public async processarVerificacaoOfensiva(
        usuarioId: number
    ): Promise<boolean> {
        // 1. Buscar o perfil e o ID do perfil
        const perfil = await this.buscarPorUsuarioId(usuarioId);
        if (!perfil) throw new Error("Perfil não encontrado.");

        // 2. Buscar registros de HOJE (ou do dia que se quer validar)
        // Usamos o RegistroHabitoService para pegar os dados do banco
        const hoje = new Date().toISOString().split("T")[0];

        // Buscamos os registros e filtramos apenas os que pertencem a hábitos DIÁRIOS
        const [rows]: any = await pool.query(
            `SELECT r.* FROM RegistrosHabito r
             INNER JOIN Habitos h ON r.habito_id = h.id
             WHERE h.perfil_id = ? AND r.dataReferencia = ? AND h.frequencia = ?`,
            [perfil.id, hoje, FrequenciaEnum.DIARIO]
        );

        const registrosDiarios = rows.map((r: any) => new RegistroHabito(r));

        // 3. Lógica de Negócio: O Model decide se a ofensiva é válida
        const cumpriuMetasDiarias = perfil.verificarOfensiva(registrosDiarios);

        // 4. Persistência: Atualizar o banco de dados com base na decisão do Model
        if (cumpriuMetasDiarias) {
            await this.incrementarOfensiva(perfil.id);
            return true;
        } else {
            return false;
        }
    }
}
