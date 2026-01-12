import { FrequenciaEnum } from './enums';

export class Habito {
  private _id: number;
  private _nome: string;
  private _categoria: string;
  private _frequencia: FrequenciaEnum;
  private _unidadeMedida: string;
  private _metaAlvo: number;
  private _ativo: boolean;
  private _motivacao: string;

  constructor(dados?: Partial<Habito>) {
    if (dados) {
      this._id = dados.id!;
      this._nome = dados.nome!;
      this._categoria = dados.categoria!;
      this._frequencia = dados.frequencia!;
      this._unidadeMedida = dados.unidadeMedida!;
      this._metaAlvo = dados.metaAlvo!;
      this._ativo = dados.ativo ?? true;
      this._motivacao = dados.motivacao!;
    }
  }

  get id(): number { return this._id; }
  get nome(): string { return this._nome; }
  set nome(value: string) { this._nome = value; }
  get metaAlvo(): number { return this._metaAlvo; }
  set metaAlvo(value: number) { this._metaAlvo = value; }
  get ativo(): boolean { return this._ativo; }
  set ativo(value: boolean) { this._ativo = value; }

  public editar(nome: string, meta: number): void {
    this.nome = nome;
    this.metaAlvo = meta;
  }

  public arquivar(): void {
    this.ativo = false;
  }
}