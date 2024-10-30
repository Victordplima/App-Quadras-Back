import { Router } from "express";
import * as quadraController from "../controllers/quadraController";

const router = Router();

router.get("/", quadraController.buscarTodasQuadras);
router.get("/:quadraId/esportes", quadraController.buscarEsportesDaQuadra);

export default router;
