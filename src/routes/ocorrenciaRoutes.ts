import { Router } from "express";
import {
    criarOcorrenciaController,
    listarOcorrenciasController,
    editarOcorrencia,
    deletarOcorrencia,
} from "../controllers/ocorrenciaController";
import { protegerRota } from "../middleware/authMiddleware";
import { verificarPermissoes } from "../middleware/verificarPermissoes";

const router: Router = Router();

router.post("/", protegerRota, verificarPermissoes, criarOcorrenciaController);

router.get("/", protegerRota, verificarPermissoes, listarOcorrenciasController);

router.put("/:id", protegerRota, verificarPermissoes, editarOcorrencia);

router.delete("/:id", protegerRota, verificarPermissoes, deletarOcorrencia);

export default router;
