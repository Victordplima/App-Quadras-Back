import request from 'supertest';
import express from 'express';
import { register, login } from '../controllers/authController';

jest.mock('../models/userModel', () => ({
    criarUsuario: jest.fn(),
    encontrarUsuarioPorEmail: jest.fn(),
    validarSenha: jest.fn(),
}));

const { criarUsuario, encontrarUsuarioPorEmail, validarSenha } = require('../models/userModel');

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

describe('AuthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve registrar um usuário com sucesso', async () => {
        const mockUsuario = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            senha: '123456',
            telefone: '123456789',
            matricula: '2022001',
            curso: 'Engenharia',
            role: 'aluno',
        };

        criarUsuario.mockResolvedValue({ id: mockUsuario.id, nome: mockUsuario.nome, email: mockUsuario.email });

        encontrarUsuarioPorEmail.mockResolvedValue(null);

        const response = await request(app)
            .post('/register')
            .send({
                nome: mockUsuario.nome,
                email: mockUsuario.email,
                senha: mockUsuario.senha,
                telefone: mockUsuario.telefone,
                matricula: mockUsuario.matricula,
                curso: mockUsuario.curso,
                role: mockUsuario.role,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario).toEqual({
            id: mockUsuario.id,
            nome: mockUsuario.nome,
            email: mockUsuario.email,
        });
    });

    it('deve falhar se o email já estiver registrado', async () => {
        const mockUsuario = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            senha: '123456',
        };

        encontrarUsuarioPorEmail.mockResolvedValue(mockUsuario);

        const response = await request(app)
            .post('/register')
            .send({
                nome: mockUsuario.nome,
                email: mockUsuario.email,
                senha: mockUsuario.senha,
            });

        expect(response.status).toBe(400);
        expect(response.body.mensagem).toBe('Usuário já registrado com este email');
    });

    it('deve realizar login com sucesso', async () => {
        const mockUsuario = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            senha: '123456',
        };

        encontrarUsuarioPorEmail.mockResolvedValue(mockUsuario);

        validarSenha.mockResolvedValue(true);

        const response = await request(app)
            .post('/login')
            .send({
                email: mockUsuario.email,
                senha: mockUsuario.senha,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario).toEqual({
            id: mockUsuario.id,
            nome: mockUsuario.nome,
            email: mockUsuario.email,
        });
    });

    it('deve falhar no login se a senha estiver incorreta', async () => {
        const mockUsuario = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            senha: '123456',
        };

        encontrarUsuarioPorEmail.mockResolvedValue(mockUsuario);

        validarSenha.mockResolvedValue(false);

        const response = await request(app)
            .post('/login')
            .send({
                email: mockUsuario.email,
                senha: 'senhaErrada',
            });

        expect(response.status).toBe(400);
        expect(response.body.mensagem).toBe('Credenciais inválidas');
    });
});
