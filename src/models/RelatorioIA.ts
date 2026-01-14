import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class RelatorioIA {
  private _id: number;
  private _textoAnalise: string;
  private _dataInicio: Date;
  private _dataFim: Date;
  private _dataGeracao: Date;

  // Usamos 'any' no construtor para evitar o conflito de propriedades privadas no Partial
  constructor(dados?: Partial<RelatorioIA>) {
    if (dados) {
      this._id = dados.id!;
      this._textoAnalise = dados.textoAnalise!;
      this._dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date();
      this._dataFim = dados.dataFim ? new Date(dados.dataFim) : new Date();
      this._dataGeracao = dados.dataGeracao ? new Date(dados.dataGeracao) : new Date();
    }
  }

  // Getters
  get id(): number { return this._id; }
  get textoAnalise(): string { return this._textoAnalise; }
  get dataInicio(): Date { return this._dataInicio; }
  get dataFim(): Date { return this._dataFim; }
  get dataGeracao(): Date { return this._dataGeracao; }

  // Setters
  set textoAnalise(value: string) { this._textoAnalise = value; }
  set dataInicio(value: Date) { this._dataInicio = value; }
  set dataFim(value: Date) { this._dataFim = value; }
  set dataGeracao(value: Date) { this._dataGeracao = value; }

  public async gerar(dados: any): Promise<void> {
    console.log("Processando dados para IA...");

    const model = "gemini-1.5-flash";

    const prompt = `
      Analise os dados do usuário e gere um relatório de análise de hábitos.
      Dados fornecidos:
      - Perfil: ${dados.perfil}
      - Hábitos: ${dados.habitos}
      - Registros: ${dados.registros}
    `;

    try {
      const response = await ai.models.generateContent({model, contents: prompt});
      const result = response.text;
      this._textoAnalise = result!;
    }
    catch (error) {
      console.error("Erro ao gerar relatório com IA:", error);
      this._textoAnalise = "Erro ao gerar relatório.";
    }
  }

  toJSON(): any {
    return {
      id: this._id,
      textoAnalise: this._textoAnalise,
      dataInicio: this._dataInicio.toISOString().split('T')[0],
      dataFim: this._dataFim.toISOString().split('T')[0],
      dataGeracao: this._dataGeracao,
    };
  }
}

// TODO: Service, Controller e Routes do Relatoria IA,
// além de fazer o funcionamento usando o GEMINI do GOOGLE