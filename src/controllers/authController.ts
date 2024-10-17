import { Request, Response } from 'express';
import { registrarUsuario, logarUsuario, editarUsuario, deletarUsuario, buscarUsuarioPorId, listarUsuarios } from '../business/userBusiness';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, email, senha, telefone, matricula, curso, role } = req.body;

        if (!nome || !email || !senha || !telefone || !matricula || !curso || !role) {
            res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' });
            return;
        }

        const resultado = await registrarUsuario(nome, email, senha, telefone, matricula, curso, role);
        res.status(201).json(resultado);
    } catch (error: any) {
        console.error("Erro durante o registro do usuário:", error);
        res.status(400).json({ mensagem: error.message });
    }
};



export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' });
            return;
        }

        const resultado = await logarUsuario(email, senha);
        res.status(200).json(resultado);
    } catch (error: any) {
        res.status(400).json({ mensagem: error.message });
    }
};

export const editar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, matricula, curso, role } = req.body;

        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            res.status(400).json({ mensagem: 'ID inválido' });
            return;
        }

        const resultado = await editarUsuario(idNumber, nome, email, telefone, matricula, curso, role);
        res.status(200).json(resultado);
    } catch (error: any) {
        res.status(400).json({ mensagem: error.message });
    }
};

export const deletar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            res.status(400).json({ mensagem: 'ID inválido' });
            return;
        }

        const resultado = await deletarUsuario(idNumber);
        res.status(200).json(resultado);
    } catch (error: any) {
        res.status(400).json({ mensagem: error.message });
    }
};

export const buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            res.status(400).json({ mensagem: 'ID inválido' });
            return;
        }

        const usuario = await buscarUsuarioPorId(idNumber);
        res.status(200).json(usuario);
    } catch (error: any) {
        res.status(404).json({ mensagem: error.message });
    }
};

export const listar = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error: any) {
        res.status(400).json({ mensagem: error.message });
    }
};
