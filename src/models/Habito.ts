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
  get frequencia(): FrequenciaEnum { return this._frequencia; }
  set frequencia(value: FrequenciaEnum) { this._frequencia = value; }
  get categoria(): string { return this._categoria; }
  set categoria(value: string) { this._categoria = value; }
  get unidadeMedida(): string { return this._unidadeMedida; }
  set unidadeMedida(value: string) { this._unidadeMedida = value; }
  get motivacao(): string { return this._motivacao; }
  set motivacao(value: string) { this._motivacao = value; }

  public editar(nome: string, metaAlvo: number, motivacao: string, frequencia: FrequenciaEnum, categoria: string, unidadeMedida: string): void {
    this.nome = nome;
    this.metaAlvo = metaAlvo;
    this.motivacao = motivacao;
    this.frequencia = frequencia;
    this.categoria = categoria;
    this.unidadeMedida = unidadeMedida;
  }

  public arquivar(): void {
    this.ativo = false;
  }

  toJSON(): any {
    return {
      id: this._id,
      nome: this._nome,
      categoria: this._categoria,
      frequencia: this._frequencia,
      unidadeMedida: this._unidadeMedida,
      metaAlvo: this._metaAlvo,
      ativo: this._ativo,
      motivacao: this._motivacao,
    };
  }
}