import { Request, Response } from 'express';
import { criarUsuario, encontrarUsuarioPorEmail, validarSenha } from '../models/userModel';
import { gerarToken } from '../utils/tokenUtils';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, email, senha, telefone, matricula, curso, role } = req.body;

        const usuarioExistente = await encontrarUsuarioPorEmail(email);
        if (usuarioExistente) {
            res.status(400).json({ mensagem: 'Usuário já registrado com este email' });
            return;
        }

        const novoUsuario = await criarUsuario(nome, email, senha, telefone, matricula, curso, role);

        const token = gerarToken(novoUsuario.id.toString(), novoUsuario.nome, novoUsuario.email);

        res.status(201).json({ token, usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email } });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no servidor', error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha } = req.body;

        const usuario = await encontrarUsuarioPorEmail(email);
        if (!usuario) {
            res.status(400).json({ mensagem: 'Credenciais inválidas' });
            return;
        }

        const senhaCorreta = await validarSenha(senha, usuario.senha);
        if (!senhaCorreta) {
            res.status(400).json({ mensagem: 'Credenciais inválidas' });
            return;
        }

        const token = gerarToken(usuario.id.toString(), usuario.nome, usuario.email);
        res.status(200).json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no servidor', error });
    }
};
