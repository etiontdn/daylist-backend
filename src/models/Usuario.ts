import { TipoUsuarioEnum } from "./enums";
import bcrypt from "bcrypt";

/*
Neste arquivo estamos assumindo que o backend receberá a senha como texto diretamente
do cliente (frontend) e será responsável por fazer o hash antes de armazená-la.
Isto é apenas um exemplo simplificado. Por se tratar de um trabalho acadêmico.
*/

export class Usuario {
    private _id: number;
    private _email: string;
    private _senha_hash: string;
    private _tipo_usuario: TipoUsuarioEnum;

    private readonly SALT_ROUNDS = 10;

    constructor(dados?: Partial<Usuario>) {
        if (dados) {
            this._id = dados.id!;
            this._email = dados.email!;
            this._senha_hash = (dados as any)._senha_hash;
            this._tipo_usuario = dados.tipo_usuario!;
        }
    }

    get id(): number {
        return this._id;
    }

    get email(): string {
        return this._email;
    }
    set email(value: string) {
        this._email = value;
    }

    get tipo_usuario(): TipoUsuarioEnum {
        return this._tipo_usuario;
    }
    set tipo_usuario(value: TipoUsuarioEnum) {
        this._tipo_usuario = value;
    }

    get senha_hash(): string {
        return this._senha_hash;
    }

    /**
     * Compara a senha enviada pelo usuário com o hash armazenado no banco.
     * @param senha Texto puro enviado pelo frontend
     */
    public async autenticar(senha: string): Promise<boolean> {
        if (!this._senha_hash) return false;
        // O bcrypt.compare verifica se o texto plano gera o mesmo hash
        return await bcrypt.compare(senha, this._senha_hash);
    }

    /**
     * Gera um novo hash a partir de uma senha em texto puro e atualiza o atributo.
     * @param novaSenha Texto puro
     */
    public async alterarSenha(novaSenha: string): Promise<void> {
        this._senha_hash = await bcrypt.hash(novaSenha, this.SALT_ROUNDS);
    }

    public getTipo(): TipoUsuarioEnum {
        return this._tipo_usuario;
    }
}
