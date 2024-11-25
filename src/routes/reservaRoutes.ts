import { Router } from "express";
import * as reservaController from "../controllers/reservaController";
import { protegerRota } from "../middleware/authMiddleware";
import { verificarPermissoes } from "../middleware/verificarPermissoes";
import {
    verificarHorarioPermitido,
    verificarReservaConsecutiva,
} from "../middleware/reservaMiddleware";
import { verificarBloqueio } from "../middleware/verificarBloqueio";

const router = Router();

// Criar uma nova reserva
router.post(
    "/",
    protegerRota,
    verificarBloqueio,
    verificarHorarioPermitido,
    verificarReservaConsecutiva,
    reservaController.criarReserva
);

// Buscar reservas da semana
router.get(
    "/semana",
    protegerRota,
    verificarPermissoes,
    reservaController.buscarReservasDaSemana
);

// Buscar reservas por usuário
router.get(
    "/usuario/:usuarioId",
    protegerRota,
    reservaController.buscarReservasPorUsuario
);

// Alterar o status de uma reserva
router.put(
    "/status/:reservaId",
    protegerRota,
    verificarPermissoes,
    reservaController.alterarStatusReserva
);

// Buscar agendamentos por quadra e dia
router.get(
    "/:quadraId/agendamentos",
    protegerRota,
    reservaController.buscarAgendamentosPorQuadraEDia
);

// Cancelar uma reserva (atualiza o status para "Cancelada" e aplica bloqueio se necessário)
router.put(
    "/:reservaId/cancelar",
    protegerRota,
    reservaController.cancelarReserva
);

export default router;
