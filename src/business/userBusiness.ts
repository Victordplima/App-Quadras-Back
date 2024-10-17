import { criarUsuarioDB, encontrarUsuarioPorEmailDB, editarUsuarioDB, deletarUsuarioDB, encontrarUsuarioPorIdDB, listarUsuariosDB } from '../data/userData';
import { hashSenha, validarSenha } from '../utils/passwordUtils';
import { gerarToken } from '../utils/tokenUtils';


export const registrarUsuario = async (
    nome: string,
    email: string,
    senha: string,
    telefone: string,
    matricula: string,
    curso: string,
    role: string
) => {
    const usuarioExistente = await encontrarUsuarioPorEmailDB(email);
    if (usuarioExistente) {
        throw new Error('Usuário já registrado com este email');
    }
    const senhaHash = await hashSenha(senha);
    const novoUsuario = await criarUsuarioDB(nome, email, senhaHash, telefone, matricula, curso, role);
    
    const token = gerarToken(novoUsuario.id.toString(), novoUsuario.nome, novoUsuario.email, novoUsuario.role);
    return { token, usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, role: novoUsuario.role } };
};



export const editarUsuario = async (
    id: number,
    nome: string,
    email: string,
    telefone: string,
    matricula: string,
    curso: string,
    role: string
) => {
    const usuarioExistente = await encontrarUsuarioPorIdDB(id.toString());
    if (!usuarioExistente) {
        throw new Error('Usuário não encontrado');
    }
    const atualizado = await editarUsuarioDB(id.toString(), nome, email, telefone, matricula, curso, role);
    if (!atualizado) {
        throw new Error('Erro ao atualizar usuário');
    }
    return { mensagem: 'Usuário atualizado com sucesso' };
};



export const deletarUsuario = async (id: number) => {
    const usuarioExistente = await encontrarUsuarioPorIdDB(id.toString());
    if (!usuarioExistente) {
        throw new Error('Usuário não encontrado');
    }
    const deletado = await deletarUsuarioDB(id.toString());
    if (!deletado) {
        throw new Error('Erro ao deletar usuário');
    }
    return { mensagem: 'Usuário deletado com sucesso' };
};



export const buscarUsuarioPorId = async (id: number) => {
    const usuario = await encontrarUsuarioPorIdDB(id.toString());
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    return usuario;
};



export const listarUsuarios = async () => {
    return await listarUsuariosDB();
};



export const logarUsuario = async (email: string, senha: string) => {
    const usuario = await encontrarUsuarioPorEmailDB(email);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    const senhaValida = await validarSenha(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error('Senha incorreta');
    }

    const token = gerarToken(usuario.id.toString(), usuario.nome, usuario.email, usuario.role);
    return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role } };
};

