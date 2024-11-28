import { Router } from "express";
import {
    criarOcorrenciaController,
    listarOcorrenciasController,
} from "../controllers/ocorrenciaController";
import { protegerRota } from "../middleware/authMiddleware";
import { verificarPermissoes } from "../middleware/verificarPermissoes";

const router: Router = Router();

router.post("/", protegerRota,
    verificarPermissoes, criarOcorrenciaController);
router.get("/", protegerRota,
    verificarPermissoes, listarOcorrenciasController);

export default router;
