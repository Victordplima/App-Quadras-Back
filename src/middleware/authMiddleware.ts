import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UsuarioModelo } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "quadrasmaneiras123";

export const protegerRota = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({
            mensagem: "Acesso negado, token não fornecido",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UsuarioModelo;
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ mensagem: "Token inválido" });
    }
};
