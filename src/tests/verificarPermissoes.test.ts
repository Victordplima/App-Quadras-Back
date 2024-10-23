import { Request, Response, NextFunction } from "express";
import { verificarPermissoes } from "../middleware/verificarPermissoes";
import { UsuarioModelo } from "../models/userModel";

describe("Middleware verificarPermissoes", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            usuario: {} as UsuarioModelo,
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("Deve permitir acesso se o usuário for admin", () => {
        req.usuario = { role: "admin" } as UsuarioModelo;

        verificarPermissoes(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled(); // O middleware deve permitir continuar
    });

    it("Deve permitir acesso se o usuário for supervisao", () => {
        req.usuario = { role: "supervisao" } as UsuarioModelo;

        verificarPermissoes(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled(); // O middleware deve permitir continuar
    });

    it("Deve negar acesso se o usuário não for admin ou supervisao", () => {
        req.usuario = { role: "aluno" } as UsuarioModelo;

        verificarPermissoes(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            mensagem:
                "Acesso negado. Apenas administradores ou supervisores podem realizar esta ação.",
        });
        expect(next).not.toHaveBeenCalled(); // O middleware deve bloquear o acesso
    });
});
