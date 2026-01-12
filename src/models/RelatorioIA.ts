export class RelatorioIA {
  private _id: number;
  private _textoAnalise: string;
  private _dataInicio: Date;
  private _dataFim: Date;
  private _dataGeracao: Date;

  constructor(dados?: Partial<RelatorioIA>) {
    if (dados) {
      this._id = dados.id!;
      this._textoAnalise = dados.textoAnalise!;
      this._dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date();
      this._dataFim = dados.dataFim ? new Date(dados.dataFim) : new Date();
      this._dataGeracao = dados.dataGeracao ? new Date(dados.dataGeracao) : new Date();
    }
  }

  get id(): number { return this._id; }
  get textoAnalise(): string { return this._textoAnalise; }

  public gerar(dados: any): void {
    console.log("Processando dados para IA...");
  }
}