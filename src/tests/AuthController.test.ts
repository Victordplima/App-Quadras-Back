import request from 'supertest';
import express from 'express';
import { register, login } from '../controllers/authController';

// Mock da camada de dados e utilitários
jest.mock('../models/userModel', () => ({
    criarUsuario: jest.fn(),
    encontrarUsuarioPorEmail: jest.fn(),
    validarSenha: jest.fn(),
}));

jest.mock('../utils/tokenUtils', () => ({
    gerarToken: jest.fn(),
}));

const { criarUsuario, encontrarUsuarioPorEmail, validarSenha } = require('../models/userModel');
const { gerarToken } = require('../utils/tokenUtils');

// Configuração do app Express
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
            nome: 'João Silva',
            email: 'joao.silva@emaila.com',
            senha: 'senha123',
            telefone: '123456789',
            matricula: '1-23-11556',
            curso: 'Engenharia',
            role: 'aluno',
        };

        // Simulando que o usuário ainda não existe
        encontrarUsuarioPorEmail.mockResolvedValue(null);

        // Simulando a criação de usuário com UUID
        criarUsuario.mockResolvedValue({
            id: 'df4b3261-f157-4358-8eb8-a9f89a057a1b',  // UUID simulado
            nome: mockUsuario.nome,
            email: mockUsuario.email,
        });

        // Simulando a geração do token
        gerarToken.mockReturnValue('token-falso');

        const response = await request(app)
            .post('/register')
            .send(mockUsuario);

        expect(response.status).toBe(201);  // Status correto
        expect(response.body).toHaveProperty('token', 'token-falso');  // Token correto
        expect(response.body.usuario).toEqual({
            nome: mockUsuario.nome,
            email: mockUsuario.email,
        });

        // Verificando que o id é do tipo string (para simular UUID)
        expect(typeof response.body.usuario.id).toBe('string');
        expect(response.body.usuario.id).toHaveLength(36);  // Comprimento típico de UUID
    });

    it('deve falhar se o email já estiver registrado', async () => {
        const mockUsuario = {
            nome: 'João Silva',
            email: 'joao.silva@emaila.com',
            senha: 'senha123',
            telefone: '123456789',
            matricula: '1-23-11556',
            curso: 'Engenharia',
            role: 'aluno',
        };

        // Simulando que o usuário já existe
        encontrarUsuarioPorEmail.mockResolvedValue(mockUsuario);

        const response = await request(app)
            .post('/register')
            .send(mockUsuario);

        expect(response.status).toBe(400);
        expect(response.body.mensagem).toBe('Usuário já registrado com este email');
    });

    it('deve realizar login com sucesso', async () => {
        const mockUsuario = {
            id: '5bfc7027-3756-42ea-855b-e4a481fac506',  // ID ajustado para simular o banco
            nome: 'João Silva',
            email: 'joao.silva@email.com',
            senha: 'senha123',
        };

        encontrarUsuarioPorEmail.mockResolvedValue(mockUsuario);
        validarSenha.mockResolvedValue(true);
        gerarToken.mockReturnValue('token-falso');

        const response = await request(app)
            .post('/login')
            .send({
                email: mockUsuario.email,
                senha: mockUsuario.senha,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token', 'token-falso');
        expect(response.body.usuario).toEqual({
            id: mockUsuario.id,
            nome: mockUsuario.nome,
            email: mockUsuario.email,
        });
    });

    it('deve falhar no login se a senha estiver incorreta', async () => {
        const mockUsuario = {
            id: 'uuid-gerado-no-banco',
            nome: 'João Silva',
            email: 'joao.silva@email.com',
            senha: 'senha123',
        };

        encontrarUsuarioPorEmail.mockResolvedValue(mockUsuario);
        validarSenha.mockResolvedValue(false);  // Simulando senha incorreta

        const response = await request(app)
            .post('/login')
            .send({
                email: mockUsuario.email,
                senha: 'senhaErrada',
            });

        expect(response.status).toBe(400);
        expect(response.body.mensagem).toBe('Senha incorreta');
    });

    it('deve falhar no login se o email não estiver registrado', async () => {
        // Simulando que o email não está registrado
        encontrarUsuarioPorEmail.mockResolvedValue(null);

        const response = await request(app)
            .post('/login')
            .send({
                email: 'emailInexistente@email.com',
                senha: 'qualquerSenha',
            });

        expect(response.status).toBe(400);
        expect(response.body.mensagem).toBe('Usuário não encontrado');
    });
});
