export interface UsuarioModelo {
    id: string;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    matricula: string;
    curso: string;
    role: 'aluno' | 'atletica' | 'admin' | 'supervisao';
    bloqueado: boolean;
}
