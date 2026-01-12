import { StatusHabitoEnum } from './enums';

export class RegistroHabito {
  private _id: number;
  private _dataReferencia: Date;
  private _qtdRealizada: number;
  private _status: StatusHabitoEnum;
  private _atualizadoEm: Date;

  constructor(dados?: Partial<RegistroHabito>) {
    if (dados) {
      this._id = dados.id!;
      this._dataReferencia = dados.dataReferencia ? new Date(dados.dataReferencia) : new Date();
      this._qtdRealizada = dados.qtdRealizada || 0;
      this._status = dados.status || StatusHabitoEnum.PENDENTE;
      this._atualizadoEm = dados.atualizadoEm ? new Date(dados.atualizadoEm) : new Date();
    }
  }

  get id(): number { return this._id; }
  get qtdRealizada(): number { return this._qtdRealizada; }
  set qtdRealizada(value: number) { this._qtdRealizada = value; }
  get status(): StatusHabitoEnum { return this._status; }
  set status(value: StatusHabitoEnum) { this._status = value; }
  get dataReferencia(): Date { return this._dataReferencia; }
  set dataReferencia(value: Date) { this._dataReferencia = value; }
  get atualizadoEm(): Date { return this._atualizadoEm; }
  set atualizadoEm(value: Date) { this._atualizadoEm = value; }

  public adicionarProgresso(qtd: number): void {
    this._qtdRealizada += qtd;
    this._atualizadoEm = new Date();
  }

  public definirStatus(meta: number): void {
    if (this._qtdRealizada >= meta) this._status = StatusHabitoEnum.CONCLUIDO;
    else if (this._qtdRealizada > 0) this._status = StatusHabitoEnum.PARCIAL;
    else this._status = StatusHabitoEnum.PENDENTE;
  }
}