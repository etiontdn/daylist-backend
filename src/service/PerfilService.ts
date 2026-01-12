import pool from "../database";
import { Perfil } from "../models/Perfil";

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
    public async atualizarBiometria(usuarioId: number, peso: number, altura: number): Promise<void> {
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
            alturaAtual: perfil.alturaCm
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
}