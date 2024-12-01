import express from "express";
import {
    buscarUsuario,
    editarUsuario,
    deletarUsuario,
    listarTodosUsuarios,
    buscarHistoricoUsuario,
    buscarInformacoesUsuarioCompleto,
} from "../controllers/userController";
import { protegerRota } from "../middleware/authMiddleware";
import { verificarAdmin } from "../middleware/verificarAdmin";

const router = express.Router();

router.get("/:id", protegerRota, verificarAdmin, buscarUsuario);
router.put("/:id", protegerRota, verificarAdmin, editarUsuario);
router.delete("/:id", protegerRota, verificarAdmin, deletarUsuario);
router.get("/", protegerRota, verificarAdmin, listarTodosUsuarios);
router.get(
    "/:id/historico",
    protegerRota,
    verificarAdmin,
    buscarHistoricoUsuario
);
router.get(
    "/:id/informacoes-completas",
    protegerRota,
    verificarAdmin,
    buscarInformacoesUsuarioCompleto
);

export default router;
