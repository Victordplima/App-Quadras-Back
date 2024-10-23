import { Router } from "express";
import * as reservaController from "../controllers/reservaController";
import { protegerRota } from "../middleware/authMiddleware";
import { verificarPermissoes } from "../middleware/verificarPermissoes";

const router = Router();

router.post("/", protegerRota, reservaController.criarReserva);
router.get("/semana", protegerRota, verificarPermissoes, reservaController.buscarReservasDaSemana);
router.get("/usuario/:usuarioId", protegerRota, reservaController.buscarReservasPorUsuario);
router.put("/status/:reservaId", protegerRota, verificarPermissoes, reservaController.alterarStatusReserva);

export default router;
