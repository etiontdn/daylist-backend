import { SexoEnum, StatusHabitoEnum } from './enums';
import { RegistroHabito } from './RegistroHabito';

export class Perfil {
  private _id: number;
  private _dataNascimento: Date;
  private _sexo: SexoEnum;
  private _alturaCm: number;
  private _pesoKg: number;
  private _ofensivaAtual: number;
  private _maiorOfensiva: number;

  constructor(dados?: Partial<Perfil>) {
    if (dados) {
      this._id = dados.id!;
      this._dataNascimento = dados.dataNascimento ? new Date(dados.dataNascimento) : new Date();
      this._sexo = dados.sexo!;
      this._alturaCm = dados.alturaCm!;
      this._pesoKg = dados.pesoKg!;
      this._ofensivaAtual = dados.ofensivaAtual || 0;
      this._maiorOfensiva = dados.maiorOfensiva || 0;
    }
  }

  get id(): number { return this._id; }
  get dataNascimento(): Date { return this._dataNascimento; }
  set dataNascimento(value: Date) { this._dataNascimento = value; }
  get sexo(): SexoEnum { return this._sexo; }
  set sexo(value: SexoEnum) { this._sexo = value; }
  get alturaCm(): number { return this._alturaCm; }
  set alturaCm(value: number) { this._alturaCm = value; }
  get pesoKg(): number { return this._pesoKg; }
  set pesoKg(value: number) { this._pesoKg = value; }
  get ofensivaAtual(): number { return this._ofensivaAtual; }
  set ofensivaAtual(value: number) { this._ofensivaAtual = value; }
  get maiorOfensiva(): number { return this._maiorOfensiva; }

  public atualizarDados(peso: number, altura: number, dataNascimento: Date, sexo: SexoEnum): void {
    this.pesoKg = peso;
    this.alturaCm = altura;
    this.dataNascimento = dataNascimento;
    this.sexo = sexo;
  }

  public calcularIMC(): number {
    const alturaMetros = this._alturaCm / 100;
    return this._pesoKg / (alturaMetros * alturaMetros);
  }

  public verificarOfensiva(registrosOntem: RegistroHabito[]): boolean {
    if (registrosOntem.length === 0) {
        return false;
    }
    const todosConcluidos = registrosOntem.every(registro => 
        registro.status === StatusHabitoEnum.CONCLUIDO
    );

    return todosConcluidos;
}
}