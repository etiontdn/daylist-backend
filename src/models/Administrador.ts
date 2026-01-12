import { Usuario } from './Usuario';

export class Administrador {
  private _id: number;

  constructor(dados?: Partial<Administrador>) {
    if (dados) {
      this._id = dados.id!;
    }
  }

  get id(): number { return this._id; }

  public cadastrarUsuario(email: string, nome: string): Usuario {
    return new Usuario({ email });
  }

  public resetarSenhaUsuario(idUsuario: number): string {
    return `senha_resetada_${idUsuario}`;
  }
}