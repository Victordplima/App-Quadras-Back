import { Router } from "express";
import * as quadraController from "../controllers/quadraController";
import { protegerRota } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protegerRota, quadraController.buscarTodasQuadras);
router.get("/:quadraId/esportes", protegerRota, quadraController.buscarEsportesDaQuadra);

export default router;
