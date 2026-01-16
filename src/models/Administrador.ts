import { Usuario } from "./Usuario";
import { TipoUsuarioEnum } from "./enums";

export class Administrador extends Usuario {
    constructor(dados?: Partial<Administrador>) {
        super(dados);
        this.tipo_usuario = TipoUsuarioEnum.ADMIN;
    }

    public cadastrarUsuario(email: string, nome: string): Usuario {
        return new Usuario({ name: nome, email, tipo_usuario: TipoUsuarioEnum.CLIENTE });
    }

    public resetarSenhaUsuario(idUsuario: number): string {
        // Gera a senha nova
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let senha = "";
        for (let i = 0; i < 8; i++) {
            senha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return senha;
    }

    toJSON(): any {
        return {
            ...super.toJSON(),
            tipo_usuario: this.tipo_usuario,
        };
    }
}
