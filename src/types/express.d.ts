import { UsuarioModelo } from '../models/userModel';

declare module 'express' {
    export interface Request {
        usuario?: UsuarioModelo;
    }
}
