import { Request, Response } from 'express';
import { encontrarUsuarioPorIdDB, editarUsuarioDB, deletarUsuarioDB, listarUsuariosDB,buscarHistoricoUsuarioDB } from '../data/userData';

export const buscarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const usuario = await encontrarUsuarioPorIdDB(id);
        if (!usuario) {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
};



export const editarUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, matricula, curso, role } = req.body;
        const sucesso = await editarUsuarioDB(id, nome, email, telefone, matricula, curso, role);
        if (sucesso) {
            res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao editar usuário' });
    }
};



export const deletarUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sucesso = await deletarUsuarioDB(id);
        if (sucesso) {
            res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
};



export const listarTodosUsuarios = async (_req: Request, res: Response) => {
    try {
        const usuarios = await listarUsuariosDB();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar usuários' });
    }
};



export const buscarHistoricoUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const usuarioComHistorico = await buscarHistoricoUsuarioDB(id);

        if (!usuarioComHistorico) {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
            return;
        }

        res.status(200).json(usuarioComHistorico);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar histórico do usuário' });
    }
};