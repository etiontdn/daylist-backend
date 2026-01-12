import { TipoUsuarioEnum } from './enums';

export class Usuario {
  private _id: number;
  private _email: string;
  private _senha_hash: string;
  private _tipo_usuario: TipoUsuarioEnum;

  constructor(dados?: Partial<Usuario>) {
    if (dados) {
      this._id = dados.id!;
      this._email = dados.email!;
      this._senha_hash = (dados as any)._senha_hash;
      this._tipo_usuario = dados.tipo_usuario!;
    }
  }

  get id(): number { return this._id; }
  
  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get tipo_usuario(): TipoUsuarioEnum { return this._tipo_usuario; }
  set tipo_usuario(value: TipoUsuarioEnum) { this._tipo_usuario = value; }

  public autenticar(senha: string): boolean {
    // Lógica de verificação de hash
    return true;
  }

  public alterarSenha(novaSenha: string): void {
    this._senha_hash = novaSenha;
  }

  public getTipo(): TipoUsuarioEnum {
    return this._tipo_usuario;
  }
}