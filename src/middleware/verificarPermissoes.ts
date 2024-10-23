import { Request, Response, NextFunction } from "express";
import { UsuarioModelo } from "../models/userModel";

export const verificarPermissoes = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const usuario: UsuarioModelo | undefined = req.usuario;

    if (
        usuario &&
        (usuario.role === "admin" || usuario.role === "supervisao")
    ) {
        return next();
    }

    res.status(403).json({
        mensagem:
            "Acesso negado. Apenas administradores ou supervisores podem realizar esta ação.",
    });
};
