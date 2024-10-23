import { Router } from "express";
import * as reservaController from "../controllers/reservaController";

const router = Router();

router.post("/", reservaController.criarReserva);
router.get("/semana", reservaController.buscarReservasDaSemana);
router.get("/usuario/:usuarioId", reservaController.buscarReservasPorUsuario);
router.put("/status/:reservaId", reservaController.alterarStatusReserva);

export default router;
