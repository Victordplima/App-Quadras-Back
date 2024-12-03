import { Router } from "express";
import {
    criarBloqueio,
    buscarBloqueios,
    editarBloqueio,
    deletarBloqueio,
    buscarBloqueiosPorUsuario,
} from "../controllers/bloqueioController";

import { protegerRota } from "../middleware/authMiddleware";
import { verificarPermissoes } from "../middleware/verificarPermissoes";

const router = Router();

router.post("/", protegerRota, verificarPermissoes, criarBloqueio);
router.get("/", protegerRota, buscarBloqueios);
router.get("/:usuarioId", buscarBloqueiosPorUsuario);
router.put("/:id", protegerRota, verificarPermissoes, editarBloqueio);
router.delete("/:id", protegerRota, verificarPermissoes, deletarBloqueio);

export default router;
