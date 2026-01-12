import { Usuario } from './Usuario';
import { TipoUsuarioEnum } from './enums';

export class Administrador extends Usuario {
  
  constructor(dados?: Partial<Administrador>) {
    super(dados); 
    this.tipo_usuario = TipoUsuarioEnum.ADMIN;
  }

  public cadastrarUsuario(email: string, nome: string): Usuario {
    return new Usuario({ email, tipo_usuario: TipoUsuarioEnum.CLIENTE });
  }

  public resetarSenhaUsuario(idUsuario: number): string {
    return `senha_resetada_${idUsuario}`;
  }
}